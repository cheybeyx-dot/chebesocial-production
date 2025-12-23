declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => void;
  }
}

interface AutoTableOptions {
  html?: HTMLElement;
  startY?: number;
  // Add other options as needed
}
