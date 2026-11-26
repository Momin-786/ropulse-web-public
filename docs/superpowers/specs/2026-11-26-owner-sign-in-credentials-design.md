# Website owner sign-in setup

New owners open the emailed invitation and sign in with their website account. They choose a Back Office password and optionally choose a 4-, 5-, or 6-digit PIN. RoPulse generates a unique Register PIN and displays it once. Back Office and website passwords remain separate.

Under Workspace Setup, an active owner can generate a replacement PIN or set a new Back Office password after confirming their website password. The page shows which credentials are set. It clears inputs after saving, and the API does not return saved secrets. Changes use the existing staff credential records, terminate affected staff sessions, and expire pending reset links for the changed method. Register pairings are separate.

Deploy the API before the website. Verify invitation activation, one-time PIN display, PIN and Windows Admin sign-in, credential rotation, and rejection of an attempt from a different workspace.
