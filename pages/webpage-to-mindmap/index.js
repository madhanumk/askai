import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import "reactflow/dist/style.css";

// Initial empty flow state
const initialNodes = [];
const initialEdges = [];

export default function Home() {
  const [webpageURL, setWebpageURL] = useState("");
  const [mindmapData, setMindmapData] = useState({
    text: "Blog title Goes Here",
    children: [
      {
        text: "tutorial",
        children: [
          { text: "Point one" },
          { text: "Point two" },
          { text: "Point three" },
          { text: "Point four" },
          { text: "Point five" },
        ]
      },
      {
        text: "comments",
        children: [
          { text: "Point 1" },
          { text: "Point two" },
          { text: "Point three" },
          { text: "Point four" },
          { text: "Point five" },
        ]
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const environment = process.env.NEXT_PUBLIC_ENV === "DEV";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => {
    // Only allow connections from parent to child in the same branch
    // You can implement additional logic here if needed
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Improved function to generate nodes and edges with better branch separation
  const generateMindmap = (data) => {
    if (!data || typeof data !== "object") return;
  
    const newNodes = [];
    const newEdges = [];
    const startX = 300; // Centered X position for root node
    const startY = 250; // Start from the center
  
    // Create the root node
    const rootNodeId = "root-node";
    newNodes.push({
      id: rootNodeId,
      data: { label: data.text },
      position: { x: startX, y: startY },
      style: { 
        background: '#f0f0f0', 
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        fontWeight: 'bold'
      }
    });
    
    // Process each main branch (tutorial and comments) separately
    if (data.children && Array.isArray(data.children)) {
      // Calculate vertical spread for main branches
      const branchSpacing = 300;
      const totalBranches = data.children.length;
      const startBranchY = startY - ((totalBranches - 1) * branchSpacing) / 2;
      
      data.children.forEach((branch, branchIndex) => {
        if (!branch || !branch.text) return;
        
        // Create branch node
        const branchId = `branch-${branchIndex}`;
        const branchY = startBranchY + branchIndex * branchSpacing;
        const branchX = startX + 250; // Move right for branch nodes
        
        newNodes.push({
          id: branchId,
          data: { label: branch.text },
          position: { x: branchX, y: branchY },
          style: { 
            background: branchIndex === 0 ? '#e6f7ff' : '#fff0e6', // Different colors for different branches
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '8px'
          }
        });
        
        // Connect root to branch
        newEdges.push({ 
          id: `edge-${rootNodeId}-${branchId}`, 
          source: rootNodeId, 
          target: branchId,
          style: { stroke: branchIndex === 0 ? '#1890ff' : '#fa8c16' }
        });
        
        // Process branch children
        if (branch.children && Array.isArray(branch.children)) {
          const childrenCount = branch.children.length;
          const childSpacing = 70;
          const startChildY = branchY - ((childrenCount - 1) * childSpacing) / 2;
          
          branch.children.forEach((child, childIndex) => {
            if (!child || !child.text) return;
            
            const childId = `${branchId}-child-${childIndex}`;
            const childY = startChildY + childIndex * childSpacing;
            const childX = branchX + 250; // Move right for child nodes
            
            newNodes.push({
              id: childId,
              data: { label: child.text },
              position: { x: childX, y: childY },
              style: { 
                background: branchIndex === 0 ? '#f0f5ff' : '#fff7e6',
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                padding: '5px'
              }
            });
            
            // Connect branch to child
            newEdges.push({ 
              id: `edge-${branchId}-${childId}`, 
              source: branchId, 
              target: childId,
              style: { stroke: branchIndex === 0 ? '#69c0ff' : '#ffd591' }
            });
          });
        }
      });
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  useEffect(() => {
    if (mindmapData) {
      try {
        const data = typeof mindmapData === "string" ? JSON.parse(mindmapData) : mindmapData;
        console.log("Parsed mindmap data:", data);
        generateMindmap(data);
      } catch (error) {
        console.error("Error parsing mindmap data:", error);
      }
    }
  }, [mindmapData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!webpageURL) {
      console.log("Please enter a valid webpage URL.");
      return;
    }

    setLoading(true);

    const data = JSON.stringify({ webpageUrl: webpageURL });

    try {
      const response = await axios.post(`${apiUrl}/api/scrape-content/`, data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response:", response.data);
      

      if (response.data && response.data.content) {
        let content = response.data.content;

        try {
            content = content.replace(/<think>[\s\S]*?<\/think>/g, "");
        } catch (error) {
            console.error("Error processing content: ", error);
        }
        content = content.match(/\{.*\}|\[.*\]/s);
        console.log(content);

        let jsonString = content;

        let mindMapData = JSON.parse(jsonString);
        console.log(mindMapData)

        setMindmapData(mindMapData);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl">
        <div className="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0">
              <li className="breadcrumb-item text-sm">
                <a className="opacity-5 text-dark" href="#">Pages</a>
              </li>
              <li className="breadcrumb-item text-sm text-dark active" aria-current="page">
                Webpage To Mindmap
              </li>
            </ol>
          </nav>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container">
        {/* Heading */}
        <div style={{ textAlign: "center", padding: "0 20px" }}>
          <h1 style={{ fontFamily: "'Onest'", fontWeight: 700, fontSize: "56px", color: "#070D1B" }}>
            Webpage To{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  position: "absolute",
                  right: "-10px",
                  top: "2px",
                  backgroundColor: "#A026FF",
                  width: "245px",
                  height: "61px",
                  transform: "rotate(1.73deg)",
                  borderRadius: "10px",
                  zIndex: 1,
                }}
              ></div>
              <span style={{ position: "relative", color: "white", zIndex: 2 }}>Mindmap</span>
            </span>
          </h1>
        </div>

        {/* Form Section */}
        <div className="row g-3 align-items-end">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            {environment || true ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="inputData">Enter the Webpage URL:</label>
                  <input
                    type="url"
                    className="form-control"
                    id="inputData"
                    name="inputData"
                    value={webpageURL}
                    onChange={(e) => setWebpageURL(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-2">
                  Create Mindmap
                </button>
              </form>
            ) : (
              <p className="mt-3">This tool is only available in development mode.</p>
            )}
          </div>
          <div className="col-md-3"></div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="col-md-12 d-flex justify-content-center mt-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="ms-2">Generating mindmap...</p>
          </div>
        )}

        {/* ReactFlow Mindmap */}
        {!loading && nodes.length > 0 ? (
          <div className="mt-4" style={{ height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              defaultZoom={0.9}
            >
              <Controls />
              <MiniMap nodeStrokeWidth={3} zoomable pannable />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>
        ) : (
          !loading && <p className="mt-4 text-center">No mindmap data available.</p>
        )}
      </div>
    </>
  );
}