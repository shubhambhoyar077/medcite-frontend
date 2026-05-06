export const ACCESS_TOKEN = "@help_alchemy/auth_token";
export const EXPIRES_AT = "@help_alchemy/auth_token/expiry";
export const NOT_AUTHENTICATED = "NOT_AUTHENTICATED";

// --------multi-tab-handling-keys---------------
// key for id of each tab. Stored in session storage
export const TAB_ID = "@help_alchemy/tab_id";
// key for leader tab. One that is responsible for calling the refresh access token function at a set time interval
export const LEADER_TAB_ID = "@help_alchemy/leader_tab_id";
// stores a list of active tabs logged in. Shows an empty list when logged out
export const ACTIVE_LOGGED_IN_TABS = "@help_alchemy/active_tabs";