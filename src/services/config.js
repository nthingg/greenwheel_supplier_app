import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { TOKEN } from "./constant";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(`Lỗi: ${message}`);
      localStorage.setItem("errorMsg", `Lỗi: ${message}`);
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([
  errorLink,
  new HttpLink({
    uri: "https://btssapp.azurewebsites.net/graphql",
  }),
]);

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  let checkIsUserCall = localStorage.getItem("isUserCall");
  let userToken = localStorage.getItem("userToken");
  console.log(checkIsUserCall
    ? `Bearer ${userToken}`
    : `Bearer ${TOKEN}`)
  return {
    headers: {
      ...headers,
      authorization: checkIsUserCall
        ? `Bearer ${userToken}`
        : `Bearer ${TOKEN}`,
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
});

export default client;
