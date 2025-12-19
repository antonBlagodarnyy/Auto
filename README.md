# Auto

[Auto](https://auto-sepia.vercel.app/)

## V1.2.0-next

### Changes

1. Make mobile responsive.

2. Connect the entities with the meetings.

3. Custom tables.

4. Add a welcome screen.

## V1.1.2

### Changes

1. Made mobile responsive.

2. Added a welcome screen.

### Bug fixes

1. Container crashed after some time because it connected directly to the db.
   And so when mysql timeouts connections node throws an exception.
   
   - Switched from a direct connection to an asynchronous pool.

## V1.1.1

### Changes

1. Db connection comes from a pool instead of a direct connection.

## V1.1.0

### Changes

1. Changed overall UI.

2. Better separation of concerns and reactivity in front logic.

3. Migrated Js backend to Ts.

4. User id is now set and retrieved directly from the JWT.

5. Calendar improvements:

   - Implemented Material on Calendar.

   - Meetings component is now a dialog that is opened on clicking the day.

   - Added a badge on days that have meetings.
