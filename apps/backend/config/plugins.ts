export default ({ env }) => ({
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      landingPage: env.bool('GRAPHQL_PLAYGROUND', false),
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000,
        },
      },
    },
  },
  'users-permissions': {
    enabled: true,
    config: {
      jwtSecret: env('JWT_SECRET', 'supersecret'),
    },
  },
});
