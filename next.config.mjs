export default {
     experimental: {
       turbo: {
         resolveAlias: {
           canvas: './empty-module.ts',
        },
       },
     },
     eslint: {
      ignoreDuringBuilds: true
    },
    };