import { ActionPanel, Action, List, openExtensionPreferences, Icon } from "@raycast/api";
import { useFetch, Response } from "@raycast/utils";
import { useState } from "react";
import { URLSearchParams } from "node:url";
import { OFFICIAL_ENTE_AUTH_WEB_URL } from "./constants.js";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useFetch(
    "https://api.npms.io/v2/search?" +
      // send the search query to the API
      new URLSearchParams({ q: searchText.length === 0 ? "@raycast/api" : searchText }),
    {
      parseResponse: parseFetchResponse,
    },
  );

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search!!!!!!!!!!!!!!!!!!! npm packages..."
      throttle
    >
      <List.Section title="Results" subtitle={data?.length + ""}>
        {data?.map((searchResult) => <SearchListItem key={searchResult.name} searchResult={searchResult} />)}
      </List.Section>
    </List>
  );
}

function SearchListItem({ searchResult }: { searchResult: SearchResult }) {
  return (
    <List.Item
      title={searchResult.name}
      subtitle={searchResult.description}
      accessories={[{ text: searchResult.username }]}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.OpenInBrowser title="Open Ente Auth Web in Browser" url={OFFICIAL_ENTE_AUTH_WEB_URL} />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action
              title="Open extension preferences"
              icon={Icon.Gear}
              shortcut={{ modifiers: ["cmd"], key: "," }}
              onAction={openExtensionPreferences}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}

/** Parse the response from the fetch query into something we can display */
async function parseFetchResponse(response: Response) {
  const json = (await response.json()) as
    | {
        results: {
          package: {
            name: string;
            description?: string;
            publisher?: { username: string };
            links: { npm: string };
          };
        }[];
      }
    | { code: string; message: string };

  if (!response.ok || "message" in json) {
    throw new Error("message" in json ? json.message : response.statusText);
  }

  return json.results.map((result) => {
    return {
      name: result.package.name,
      description: result.package.description,
      username: result.package.publisher?.username,
      url: result.package.links.npm,
    } as SearchResult;
  });
}

interface SearchResult {
  name: string;
  description?: string;
  username?: string;
  url: string;
}
