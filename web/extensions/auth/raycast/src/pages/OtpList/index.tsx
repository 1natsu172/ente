import { Action, ActionPanel, List } from "@raycast/api";
import { ActionPanelCommonSection } from "../../components/ActionPanelCommonSection.js";
import { useState } from "react";

type Props = {
  isLoggedInChecking: boolean;
};
export const OtpList = (props: Props) => {
  const { isLoggedInChecking } = props;
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <List
      isLoading={isLoggedInChecking}
      onSearchTextChange={setSearchQuery}
      searchBarPlaceholder="Search :)))) npm packages..."
      throttle
      actions={
        <ActionPanel>
          <ActionPanelCommonSection />
        </ActionPanel>
      }
    >
      {/* TODOfetch and suspense here */}
      <List.Section title="Results" subtitle={data?.length + ""}>
        {data?.map((searchResult) => (
          <List.Item
            title={searchResult.name}
            subtitle={searchResult.description}
            accessories={[{ text: searchResult.username }]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action.CopyToClipboard title="Copy OTP code" content={`${searchResult.name}`} />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
};

// interface SearchResult {
//   name: string;
//   description?: string;
//   username?: string;
//   url: string;
// }
