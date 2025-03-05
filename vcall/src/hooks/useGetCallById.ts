import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
//Call:  a video call object.

//useStreamVideoClient: A hook provided by the library that returns the Stream video client instance. This client is used to interact with the Stream API (e.g., querying calls)

const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);
  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const getCall = async () => {
      try {
        const { calls } = await client.queryCalls({ filter_conditions: { id } });

        if (calls.length > 0) setCall(calls[0]);
      } catch (error) {
        console.log(error);
        setCall(undefined);
      } finally {
        setIsCallLoading(false);
      }
    };
    getCall();
  }, [client, id]);

  return { call, isCallLoading };
};

export default useGetCallById;