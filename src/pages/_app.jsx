'use client'
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "@/Components/Layout";
import AuthLayout from "@/Components/AuthLayout";
import AOS from "aos";
import { useEffect } from "react";
import CustomToast from "@/Components/StyledComponents/CustomToast";
import { Provider } from "react-redux";
import store from "@/lib/store";
// import { ThemeProvider } from '@material-ui/styles';
import { ThemeProvider } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import Loader from "@/Components/Loader";
// import GetUTCDateTime from "@/Helper/getUTCDateTime";

import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/mainheader.css";
import "@/styles/dashboard.css";
import "@/styles/styles.css";
import "@/styles/tournament.css";
import "@/styles/auction.css";


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {

  useEffect(() => {
    AOS.init({
      // startEvent: "load",
      duration: 800,
      once: false,
      offset: 100,
    });
  }, []);

  const theme = createTheme(
    { 
    palette: {
      primary: {
        main: '#191966',
      },
    },
    components: {
      MuiContainer: {
          styleOverrides: {
              maxWidthLg: {
                  maxWidth: '1440px!important',
              },
          },
      },
  },
}
  );

  return (
    <Provider store={store}>
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
      {Component.auth ? (
        <Auth userType={Component.auth.userType}>
          <AuthLayout>
            <Component {...pageProps} />
          </AuthLayout>
        </Auth>
      ) : (
        <CustomSuspence>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CustomSuspence>
       )}
      </ThemeProvider>
      <CustomToast />
    </SessionProvider>
    </Provider>
  );
}

function Auth({ children, userType }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });
  if (status === "loading") {
    return <Loader />;
  }
  if (userType !== session.user.userType) {
    router.push(`/${session.user.userType}/`);
  }
  return children;
}

function CustomSuspence({ children }) {
  const { status } = useSession();
  if (status === "loading") {
    return <Loader />;
  }
  return children;
}
