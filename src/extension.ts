import { commands, ExtensionContext } from "vscode";
import { ResponsiveViewerPanel } from "./panels/ResponsiveViewerPanel";

export function activate(context: ExtensionContext) {
  // Create the show responsive viewer command
  const showResponsiveViewerCommand = commands.registerCommand("responsive-viewer.showResponsiveViewer", () => {
    ResponsiveViewerPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showResponsiveViewerCommand);
}
