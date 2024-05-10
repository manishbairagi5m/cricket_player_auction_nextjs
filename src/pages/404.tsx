'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface SessionUser {
  userType: string;
}

export default function Custom404() {
  const router = useRouter();
  const { data: session } = useSession();


  useEffect(() => {
    const handleRouteChange = (url:string) => {
      if (url === '/404') {
        router.events.emit('routeChangeComplete', router.asPath);
        router.replace('/404', undefined, { shallow: true });
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <div 
    style={{backgroundColor:"#180238"}}
    className="d-flex justify-content-center align-items-center flex-column p-5">
      <Image
        src="/Assets/Images/404-error.svg"
        width={800}
        height={500}
        alt="img"
       />
      {/* <h1 className="text-white">404 - Page Not Found</h1> */}
        {/* <div className="d-flex align-items-center gap-3 mt-3 ">
          <button className="button-with-icon-shadow" onClick={() => router.back()}>Go Back</button>
        </div> */}
    </div>
  );
}
