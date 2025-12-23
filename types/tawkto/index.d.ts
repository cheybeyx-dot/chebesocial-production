declare module "@tawk.to/tawk-messenger-react" {
  import { Component } from "react";

  export interface TawkMessengerProps {
    propertyId: string;
    widgetId: string;
    customStyle?: Record<string, unknown>;
    onLoad?: () => void;
    onBeforeLoad?: () => void;
    onStatusChange?: (status: string) => void;
    onChatMaximized?: () => void;
    onChatMinimized?: () => void;
    onChatHidden?: () => void;
    onChatStarted?: () => void;
    onChatEnded?: () => void;
    onPrechatSubmit?: (data: unknown) => void;
    onOfflineSubmit?: (data: unknown) => void;
    onChatMessageVisitor?: (message: string) => void;
    onChatMessageAgent?: (message: string) => void;
    onChatMessageSystem?: (message: string) => void;
    onAgentJoinChat?: (data: unknown) => void;
    onAgentLeaveChat?: (data: unknown) => void;
    onChatSatisfaction?: (satisfaction: string) => void;
    onVisitorNameChanged?: (visitorName: string) => void;
    onFileUpload?: (file: unknown) => void;
    onTagsUpdated?: (tags: string[]) => void;
  }

  export default class TawkMessengerReact extends Component<TawkMessengerProps> {}
}
