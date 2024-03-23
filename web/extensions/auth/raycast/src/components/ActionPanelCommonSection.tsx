import { Action, ActionPanel, Icon, openExtensionPreferences } from "@raycast/api";
import { OFFICIAL_ENTE_AUTH_WEB_URL } from "../constants";

export const ActionPanelCommonSection = () => {
  return (
    <ActionPanel.Section>
      <Action.OpenInBrowser title="Open Ente Auth Web in Browser" url={OFFICIAL_ENTE_AUTH_WEB_URL} />
      <Action title="Open extension preferences" icon={Icon.Gear} onAction={openExtensionPreferences} />
    </ActionPanel.Section>
  );
};
