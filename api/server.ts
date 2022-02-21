import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import { context } from "./context";
import { ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault
} from "apollo-server-core";

export const server=new ApolloServer({
    schema,
    context,
    introspection:true,
    plugins: [
        // Install a landing page plugin based on NODE_ENV
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageLocalDefault()
          : ApolloServerPluginLandingPageLocalDefault(),
          
      ],
});


