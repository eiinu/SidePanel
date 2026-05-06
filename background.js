const DYNAMIC_RULE_IDS = [1, 2];

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: DYNAMIC_RULE_IDS,
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: "modifyHeaders",
          responseHeaders: [
            { header: "x-frame-options", operation: "remove" },
            { header: "content-security-policy", operation: "remove" },
            {
              header: "content-security-policy-report-only",
              operation: "remove"
            }
          ]
        },
        condition: {
          resourceTypes: ["sub_frame"],
          urlFilter: "|http",
          initiatorDomains: [chrome.runtime.id]
        }
      },
      {
        id: 2,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              header: "user-agent",
              operation: "set",
              value:
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
            }
          ]
        },
        condition: {
          resourceTypes: ["sub_frame"],
          urlFilter: "|http",
          initiatorDomains: [chrome.runtime.id]
        }
      }
    ]
  });
});
