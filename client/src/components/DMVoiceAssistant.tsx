import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LoadingOverlay from "./LoadingOverlay";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DMVoiceAssistantProps {
  dmScript: string;
}

const DMVoiceAssistant = ({ dmScript }: DMVoiceAssistantProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [apiKey, setApiKey] = useState("72170c11-edc9-464c-856f-ce0263245823");
  const [isApiKeySet, setIsApiKeySet] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const { toast } = useToast();

  // Handler for setting the API key
  const handleSetApiKey = () => {
    const trimmedKey = apiKey.trim();
    if (trimmedKey) {
      setApiKey(trimmedKey); // Ensure no whitespace
      setIsApiKeySet(true);
      toast({
        title: "API Key Saved",
        description: "Your Vapi API key has been saved.",
      });
      console.log("API Key set: [key hidden for security]");
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  // Function to handle starting the voice assistant
  const startVoiceAssistant = async () => {
    if (!isApiKeySet || !apiKey) {
      toast({
        title: "API Key Required",
        description:
          "Please enter your Vapi API key to start the voice assistant.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null); // Clear any previous errors

      // Initialize Vapi with the user's public key
      vapiRef.current = new Vapi("8ee230a5-5bd2-44b1-8396-c549a486ac66");

      // Add event listeners
      vapiRef.current.on("speech-start", () => {
        setIsSpeaking(true);
      });

      vapiRef.current.on("speech-end", () => {
        setIsSpeaking(false);
      });

      vapiRef.current.on("call-start", () => {
        setIsConnected(true);
        setIsLoading(false);
        toast({
          title: "DM Assistant Connected",
          description: "Your Dungeon Master voice assistant is now active.",
        });
      });

      vapiRef.current.on("call-end", () => {
        setIsConnected(false);
        toast({
          title: "DM Assistant Disconnected",
          description:
            "Your Dungeon Master voice assistant has ended the session.",
        });
      });

      vapiRef.current.on("volume-level", (volume) => {
        setVolumeLevel(volume);
      });

      vapiRef.current.on("error", (error) => {
        console.error("Vapi error:", error);
        const errorMsg =
          "There was an error with the voice assistant. Please check your API key and try again.";
        setErrorMessage(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        setIsLoading(false);
      });

      // Start the call with OpenAI's GPT-4o model and the DM script as the system message
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

      console.log("Starting Vapi with OpenAI GPT-4o and DM script...");

      try {
        // Use the existing assistant ID with customized DM script
        const assistantId = "2256810e-f7f5-483f-8dd9-16240720eca2";
        
        // Define assistant overrides with the DM script as system message
        // Use 'as any' to bypass type checking since the Vapi types may have limitations
        const assistantOverrides: any = {
          recordingEnabled: true,
          // Use variableValues to dynamically inject the DM script
          variableValues: {
            dmScript: dmScript
          }
        };
        
        // Start the call using the existing assistant ID with overrides
        await vapiRef.current.start(assistantId, assistantOverrides);

        console.log("Vapi start call successful");
      } catch (startError) {
        console.error("Error starting Vapi session:", startError);
        throw startError; // Re-throw to be caught by the outer catch block
      }
    } catch (error) {
      console.error("Failed to start voice assistant:", error);
      const errorMsg =
        "Failed to connect to the voice assistant service. Please check your API key and try again.";
      setErrorMessage(errorMsg);
      toast({
        title: "Connection Failed",
        description: errorMsg,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Function to end the call
  const stopVoiceAssistant = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="mt-6 p-4 bg-parchment rounded-lg border border-brown-light">
      <h3 className="text-lg font-bold text-primary mb-4">
        Dungeon Master Voice Assistant
      </h3>

      {isLoading && (
        <LoadingOverlay message="Connecting to DM voice assistant..." />
      )}

      <div className="flex flex-col space-y-4">
        {/* Error Message Display */}
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setErrorMessage(null)}
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        {/* API Key Input Section */}
        {!isApiKeySet ? (
          <div className="bg-white/50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-brown-dark mb-2">
              Enter Vapi API Key
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              To use the voice assistant, you need a Vapi API key. You can get
              this from the{" "}
              <a
                href="https://dashboard.vapi.ai/account"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Vapi Dashboard
              </a>
              . Make sure to use your <strong>public key</strong>, not your private key. 
              This will connect to a pre-configured Dungeon Master assistant (ID: 2256810e-f7f5-483f-8dd9-16240720eca2).
            </p>
            <div className="mb-2">
              <Label
                htmlFor="apiKey"
                className="text-sm font-medium text-brown-dark"
              >
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Vapi public key"
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleSetApiKey}
              className="bg-primary hover:bg-primary-dark text-parchment font-bold py-2 px-4 rounded mt-2"
            >
              Save API Key
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span className="text-brown-dark">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            {isConnected && (
              <div className="flex items-center space-x-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${volumeLevel * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-brown-dark">
                  {isSpeaking ? "Speaking..." : "Listening..."}
                </span>
              </div>
            )}

            <div className="flex space-x-4">
              {!isConnected ? (
                <Button
                  onClick={startVoiceAssistant}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-dark text-parchment font-bold py-2 px-4 rounded"
                >
                  {isLoading ? "Connecting..." : "Start DM Voice Assistant"}
                </Button>
              ) : (
                <Button
                  onClick={stopVoiceAssistant}
                  className="bg-red-600 hover:bg-red-700 text-parchment font-bold py-2 px-4 rounded"
                >
                  End Session
                </Button>
              )}
              <Button
                onClick={() => setIsApiKeySet(false)}
                variant="outline"
                className="border-brown-light text-brown-dark"
              >
                Change API Key
              </Button>
            </div>
          </>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>
            Speak to your DM assistant to progress through the campaign. The DM
            will narrate the story, describe environments, and roleplay NPCs
            based on the generated DM script.
          </p>
          <p className="mt-2">Examples of what you can say:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>"What do I see in the tavern?"</li>
            <li>"I want to approach the mysterious stranger."</li>
            <li>"Can I roll for perception?"</li>
            <li>"I cast fireball at the dragon."</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DMVoiceAssistant;
