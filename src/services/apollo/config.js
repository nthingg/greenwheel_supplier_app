import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(`Lỗi: ${message}`);
      // localStorage.setItem("checkIsUserCall", "no");
      localStorage.setItem("errorMsg", `Lỗi: ${message}`);
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([
  errorLink,
  new HttpLink({
    uri: "https://api-btss.southeastasia.cloudapp.azure.com/graphql",
  }),
]);

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  let checkIsUserCall = localStorage.getItem("checkIsUserCall");
  let userToken = localStorage.getItem("userToken");
  let token = localStorage.getItem("staffToken");
  // console.log("ADMIN " + token)
  // console.log("USER " + token)
  // console.log(checkIsUserCall)
  if (checkIsUserCall === "yes") {
    console.log("USER IS CALLING");
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${userToken}`,
      },
    };
  } else {
    console.log("STAFF IS CALLING");
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
});

export default client;
