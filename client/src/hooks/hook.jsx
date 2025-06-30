import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useErrors = (errors = [] ) => {

    useEffect(() => {

        errors.forEach(({ isError, error, fallback}) => {
            if (isError) {
                if (fallback)  fallback();
                    else toast.error(error?.data?.message || "Something want wrong");                  
            }
        })
    }, [errors])
}


const useAsyncMutation = (mutationHook) => {
    const [isloading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)

    const [mutate] = mutationHook()

    const executeMutation = async (toastMessage, ...args) => {
        setIsLoading(true);
        const toastId = toast.loading(toastMessage || "Updating data...");

           try {
            const res = await mutate(...args);
            if (res.data) {
              toast.success(res.data.message || "Updated data successfully", 
                {id: toastId
                    
                })
              setData(res.data)
            } else {
              toast.error(res?.error?.data?.message || "Something want wrong", {id:toastId})
              
            }
           } catch (error) {
            console.log(error);
            toast.error("Something want wrong", {id:toastId})
           } finally {
            setIsLoading(false)
        }
    }

    return [executeMutation, isloading , data ]
}


const useSocketEvents = (socket, handler) => {
    useEffect(() => {
        Object.entries(handler).forEach(([event, handler]) => {
            socket.on(event, handler)
        })

        return () => {
              Object.entries(handler).forEach(([event, handler]) => {
            socket.off(event, handler)
        })
        }
        
    }),
    [socket, handler]
}



const useFetchData = (url, key, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers, // Merge with provided headers
        },
      });
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON, got ${contentType}: ${text.slice(0, 50)}...`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { loading, data, error, refetch: fetchData };
};

export {useErrors, useAsyncMutation, useSocketEvents, useFetchData}