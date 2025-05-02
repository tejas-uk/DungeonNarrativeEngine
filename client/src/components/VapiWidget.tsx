import React, { useState, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// IMPORTANT: Replace with your actual Vapi Public Key
// Consider fetching this securely instead of hardcoding
const VAPI_PUBLIC_KEY = '8ee230a5-5bd2-44b1-8396-c549a486ac66'; 
// IMPORTANT: Replace with your Vapi Assistant ID
const VAPI_ASSISTANT_ID = 'YOUR_ASSISTANT_ID_HERE'; // Replace this!

type CallStatus = 'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error' | 'ended';

const VapiWidget: React.FC = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      console.log('Vapi call started');
      setCallStatus('connected');
      setErrorMessage(null);
    });

    vapiInstance.on('call-end', () => {
      console.log('Vapi call ended');
      setCallStatus('ended');
      // Reset to idle after a short delay to show 'ended' status
      setTimeout(() => setCallStatus('idle'), 2000);
    });

    vapiInstance.on('speech-start', () => {
      console.log('Vapi speech started');
      setCallStatus('speaking');
    });

    vapiInstance.on('speech-end', () => {
      console.log('Vapi speech ended');
      // Could transition back to 'connected' or 'listening' depending on flow
      // For simplicity, let's assume 'connected' after speaking ends
      if (vapiInstance.isMuted()) {
         setCallStatus('connected'); // Or maybe a specific 'muted' state?
      } else {
         setCallStatus('listening'); // Assume listening if not muted
      }
    });

    // Listening for user speech start (requires specific Vapi config/events if available)
    // Placeholder: Assume 'listening' when connected and not speaking
    // A more robust solution might involve tracking user volume or specific Vapi events

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
      setCallStatus('error');
      setErrorMessage(error.message || 'An unknown error occurred.');
      // Attempt to stop the call cleanly on error
      vapiInstance.stop();
    });
    
    // Cleanup function
    return () => {
        vapiInstance.stop();
        setVapi(null);
    };
  }, []);

  const startCall = useCallback(() => {
    if (!vapi) return;
    console.log('Attempting to start call...');
    setCallStatus('connecting');
    setErrorMessage(null);
    // Replace YOUR_ASSISTANT_ID_HERE with the actual ID
    vapi.start(VAPI_ASSISTANT_ID).catch(error => {
        console.error('Failed to start call:', error);
        setCallStatus('error');
        setErrorMessage('Failed to start the call. Check console and API keys.');
    });
  }, [vapi]);

  const stopCall = useCallback(() => {
    if (!vapi) return;
    console.log('Stopping call...');
    vapi.stop();
    // Event listener 'call-end' will update status
  }, [vapi]);

  const toggleMute = useCallback(() => {
    if (!vapi || callStatus !== 'connected') return; // Only allow mute when connected
    const newMutedState = !isMuted;
    vapi.setMuted(newMutedState);
    setIsMuted(newMutedState);
    console.log(`Microphone ${newMutedState ? 'muted' : 'unmuted'}`);
  }, [vapi, isMuted, callStatus]);

  const getStatusIndicatorClass = () => {
    switch (callStatus) {
      case 'idle': return 'bg-gray-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'connected': return 'bg-blue-500'; // General connected state
      case 'listening': return 'bg-green-500'; // Listening for user
      case 'speaking': return 'bg-purple-500 animate-pulse'; // Assistant speaking
      case 'error': return 'bg-red-500';
      case 'ended': return 'bg-gray-700';
      default: return 'bg-gray-500';
    }
  };

  const getButtonText = () => {
    switch (callStatus) {
      case 'idle':
      case 'ended':
      case 'error':
        return 'Start Voice Chat';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
      case 'listening':
      case 'speaking':
        return 'End Voice Chat';
      default:
        return 'Start Voice Chat';
    }
  };

  const handleButtonClick = () => {
    if (['idle', 'ended', 'error'].includes(callStatus)) {
      startCall();
    } else if (['connecting', 'connected', 'listening', 'speaking'].includes(callStatus)) {
      stopCall();
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md flex items-center space-x-4">
      <div className={cn('w-4 h-4 rounded-full', getStatusIndicatorClass())} title={`Status: ${callStatus}`}></div>
      <Button 
        onClick={handleButtonClick}
        disabled={callStatus === 'connecting'}
        variant={callStatus === 'error' ? 'destructive' : 'secondary'}
        className="font-cinzel"
      >
        {getButtonText()}
      </Button>
      {/* Optional Mute Button - enable when call is active */}
      {/* {['connected', 'listening', 'speaking'].includes(callStatus) && (
        <Button onClick={toggleMute} variant="outline" size="icon">
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />} 
        </Button>
      )} */}
      {callStatus === 'error' && errorMessage && (
        <p className="text-red-400 text-sm">Error: {errorMessage}</p>
      )}
      <p className="text-sm text-gray-400 capitalize">Status: {callStatus}</p>
    </div>
  );
};

export default VapiWidget;