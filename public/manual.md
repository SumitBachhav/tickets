# Ticket Management System - User Manual

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Data Storage](#data-storage)
4. [Pages and Features](#pages-and-features)
5. [Settings Configuration](#settings-configuration)
6. [Task Management](#task-management)
7. [Import/Export](#importexport)
8. [Status System](#status-system)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This is a personal Jira-like ticket management system that runs entirely in your browser. It stores all data locally using browser localStorage, with CSV files as reference templates. The application works offline and requires no backend server.

### Key Features
- ✅ Create, edit, and delete tickets
- ✅ Filter and search tickets
- ✅ Customize status types, enums, and mappings
- ✅ Dark mode support
- ✅ CSV import/export for backup
- ✅ Automatic status calculation
- ✅ Persistent local storage

---

## Getting Started

### First Launch
1. Open the application in your browser
2. The app automatically loads initial data:
   - **Tasks**: Checks localStorage → `src/data/tasks.csv` → sample data
   - **Settings**: Checks localStorage → `src/data/settings.csv` → defaults
3. If this is your first time, sample tasks will be loaded automatically

### Navigation
- **Sidebar**: Use the left sidebar to navigate between pages
- **Dark Mode Toggle**: Located at the bottom of the sidebar

---

## Data Storage

### How Data Persists

#### Tasks (Tickets)
1. **Primary Storage**: Browser `localStorage` (persists across sessions)
   - Key: `ticket_tasks`
   - Format: JSON array of task objects
   - **Persists**: Browser restarts, computer restarts, days/weeks/months
   - **Lost when**: User clears browser data, incognito mode closes, browser uninstalled

2. **Fallback Storage**: `src/data/tasks.csv`
   - Used when localStorage is empty
   - Reference template file
   - Loaded on app startup if no localStorage data exists

3. **Auto-Save**: Every task operation (add, update, delete) automatically saves to localStorage

#### Settings
1. **Primary Storage**: Browser `localStorage` (persists across sessions)
   - Key: `ticket_settings`
   - Format: JSON object with all settings
   - **Persists**: Same as tasks

2. **Fallback Storage**: `src/data/settings.csv`
   - Used when localStorage is empty
   - Reference template file
   - Contains: darkMode, prefixText, enums, statusMapping

3. **Auto-Save**: Every setting change automatically saves to localStorage

### Loading Priority Order

**Tasks Loading:**
```
1. Check localStorage → Use if exists
2. If empty → Load from src/data/tasks.csv
3. If CSV missing/empty → Use sample data from code
```

**Settings Loading:**
```
1. Check localStorage → Use if exists
2. If empty → Load from src/data/settings.csv
3. If CSV missing → Show warning, use defaults
```

### Accessing localStorage
To manually view/edit data in localStorage:

**Chrome/Edge:**
1. Press `F12` (DevTools)
2. Go to **Application** tab
3. Expand **Local Storage** in left sidebar
4. Click your site URL (e.g., `http://localhost:5173`)
5. See keys: `ticket_tasks` and `ticket_settings`

**Firefox:**
1. Press `F12` (DevTools)
2. Go to **Storage** tab
3. Expand **Local Storage** → your site URL
4. View/edit the keys

**View formatted data in Console:**
```javascript
// View tasks
JSON.parse(localStorage.getItem('ticket_tasks'))

// View settings
JSON.parse(localStorage.getItem('ticket_settings'))
```

---

## Pages and Features

### 1. Dashboard (`/`)
**Purpose**: View active tickets that need attention

**What Shows Here:**
- Tickets where `statusInternal` contains "validating"
- OR tickets where `statusExternal` contains "validating" or "in progress"

**Features:**
- **Search**: By ticket number or tags
- **Filter**: By rank, todo, status (internal), or tags
- **Sort**: By rank (high → normal) then by last updated (oldest first), or by last updated (newest first)
- **Add Task**: Button in top-right to create new ticket

**Default Sorting:**
- First: Rank (high priority first)
- Then: Last updated (oldest first)

### 2. Waiting Page (`/waiting`)
**Purpose**: View tickets waiting for action

**What Shows Here:**
- Tickets where `statusInternal` or `statusExternal` contains "waiting"

**Features:**
- Same search, filter, and sort options as Dashboard

### 3. Resolved Page (`/resolved`)
**Purpose**: View completed tickets

**What Shows Here:**
- Tickets with `statusInternal` = "resolved" or "resolved-wfc"

**Features:**
- Same search, filter, and sort options as Dashboard

### 4. All Tickets Page (`/all`)
**Purpose**: View all tickets in the system

**Features:**
- **Pagination**: Shows 20 tickets per page
- **Search**: By ticket number or tags
- **Filter**: By rank, todo, status (internal), or tags
- **Sort**: By last updated (newest/oldest) or by rank

### 5. Import/Export Page (`/import-export`)
**Purpose**: Backup and restore ticket data

**Features:**
- **Copy Tickets**: Copy recent tickets (updated in last 24 hours) to clipboard
  - Format: `prefixText + ticketNumber + " " + externalStatus`
  - Only tickets updated in last 24 hours
- **Export Tasks**: Download all tasks as CSV file
- **Import Tasks**: Upload CSV file to replace all tasks
  - ⚠️ **Warning**: This replaces ALL existing tasks

**CSV Format for Tasks:**
- Columns: `ticketNumber`, `statusInternal`, `statusExternal`, `todo`, `rank`, `notes`, `askedTo`, `lastUpdated`, `tags`
- `tags` should be comma-separated

### 6. Settings Page (`/settings`)
**Purpose**: Customize application behavior

**Sections:**
1. **Appearance**: Dark mode toggle
2. **Customize Enums**: Edit dropdown options for status, todo, rank
3. **Status Mapping**: Configure how internal statuses map to external
4. **Ticket Number Prefix**: Set prefix for copying tickets
5. **Import/Export Settings**: Backup/restore settings
6. **Reset to Defaults**: Restore all settings to defaults

---

## Settings Configuration

### Dark Mode
- **Toggle**: Switch in Settings → Appearance
- **Persistence**: Saved to localStorage immediately
- **System Preference**: On first load (if no saved settings), uses system preference

### Customize Enums
**Location**: Settings → Customize Enums

You can edit three enum types:

1. **Status (Internal)**: Internal status options
   - Default: new, validating, waiting-external, waiting-internal, resolved, resolved-wfc, someone else is handling
   - Used in: Task creation/editing

2. **Todo**: Todo options
   - Default: yes-priority, yes, no
   - Used in: Task creation/editing

3. **Rank**: Priority rank options
   - Default: normal, high
   - Used in: Task creation/editing, filtering, sorting

**How to Edit:**
- Click on an enum value to edit
- Click "×" to remove
- Type and press Enter to add new value
- Changes save automatically to localStorage

### Status Mapping Configuration
**Location**: Settings → Status Mapping Configuration

This controls how internal statuses automatically map to external statuses.

**How It Works:**
- When you select an internal status, the external status is **automatically calculated**
- You cannot manually set external status - it's always derived from internal status
- Example: If internal = "validating", external automatically becomes "In validation"

**Default Mapping:**
- `new` → `new`
- `validating` → `In validation`
- `waiting-external` → `WFC`
- `waiting-internal` → `In progress`
- `resolved` → `Resolved`
- `resolved-wfc` → `WFC`
- `someone else is handling` → `WFC`

**How to Change:**
- Select an internal status from the left dropdown
- Choose the external status it should map to from the right dropdown
- Changes save immediately

**External Status Options:**
- new
- In validation
- WFC
- In progress
- Resolved
- Closed
- Cancelled

### Ticket Number Prefix
**Location**: Settings → Ticket Number Prefix

**Purpose**: Sets a prefix that's added when copying ticket details

**Example:**
- Prefix: `TICKET-`
- Ticket Number: `4562`
- Copied Format: `TICKET-4562 In progress`

**Usage:**
- Used in Import/Export → Copy Tickets feature
- Only applies to tickets updated in last 24 hours

### Import/Export Settings
**Location**: Settings → Import/Export Settings

**Export Settings:**
- Downloads current settings as CSV file
- Includes: darkMode, prefixText, enums, statusMapping
- File name: `settings.csv`
- **Note**: To use exported settings, manually replace `src/data/settings.csv` with downloaded file

**Import Settings:**
- Upload a previously exported `settings.csv` file
- ⚠️ **Warning**: This replaces ALL current settings
- Confirmation dialog shown before import

### Reset to Defaults
**Location**: Settings → Reset to Defaults

**What It Does:**
- Resets all enums to default values
- Resets status mapping to default
- Sets darkMode to `false`
- Sets prefixText to `""` (empty)

**Confirmation**: Yes/No dialog before reset

---

## Task Management

### Creating a Task
1. Click "+ Add Task" button (available on Dashboard, Waiting, Resolved, All Tickets)
2. Fill in the form:
   - **Ticket Number** *(required)*: Unique identifier
   - **Status (Internal)**: Select from dropdown
   - **Status (External)**: *Auto-calculated* - shown as read-only
   - **Todo**: Select from dropdown
   - **Rank**: Select from dropdown
   - **Asked To**: Text field (optional)
   - **Notes**: Text area (optional)
   - **Tags**: Add tags by typing and pressing Enter
3. Click "Create Task"
4. **Toast Notification**: Shows "Ticket 'XXX' created successfully!"
5. **Auto-Save**: Task saved to localStorage immediately

**Validation:**
- Ticket number is required
- Ticket number must be unique (no duplicates allowed)
- If duplicate, error message shown in modal

### Editing a Task
1. Click "Edit" button on any task card
2. Modify fields in the modal
3. Click "Update Task"
4. **Toast Notification**: Shows "Ticket 'XXX' updated successfully!"
5. **Auto-Save**: Changes saved to localStorage immediately

**Note**: When you change `statusInternal`, `statusExternal` is automatically recalculated based on status mapping.

### Deleting a Task
1. Click "Delete" button on any task card
2. Confirm in dialog: "Are you sure you want to delete this task?"
3. **Toast Notification**: Shows "Ticket 'XXX' deleted successfully!"
4. **Auto-Save**: Deletion saved to localStorage immediately

### Task Fields

**ticketNumber**: 
- Unique identifier for the ticket
- Required field
- Case-insensitive duplicate checking
- Used in search and filtering

**statusInternal**: 
- Internal status (selectable)
- Options customizable in Settings
- Used to calculate statusExternal automatically

**statusExternal**: 
- External status (auto-calculated)
- Cannot be manually set
- Calculated from statusInternal using status mapping
- Shown as read-only in forms

**todo**: 
- Todo status
- Options: yes-priority, yes, no (customizable)

**rank**: 
- Priority rank
- Options: high, normal (customizable)
- Used in sorting (high priority first)

**notes**: 
- Free text field for notes
- No character limit

**askedTo**: 
- Person/team who asked for this ticket
- Free text field

**tags**: 
- Array of tags
- Add by typing and pressing Enter
- Used in search and filtering
- Displayed as colored pills on task cards

**lastUpdated**: 
- Auto-generated timestamp
- Format: "DD/MM/YYYY, HH:mm" (Indian locale)
- Updated on every task creation/update
- Used in sorting and filtering (recent tickets)

### Task Cards
**Display Information:**
- Ticket number (clickable/linkable)
- Status badge (color-coded)
- Todo and Rank badges
- Asked To field
- Notes preview (truncated)
- Tags (as colored pills)
- Last updated timestamp
- Edit and Delete buttons

**Status Colors:**
- `validating`: Blue
- `in progress`: Yellow
- `resolved`: Green
- `waiting`: Orange
- Default: Gray

---

## Import/Export

### Copy Tickets to Clipboard
**Location**: Import/Export → Copy Ticket Details

**What It Does:**
- Copies ticket details to clipboard for tickets updated in last 24 hours
- Format: `prefixText + ticketNumber + " " + externalStatus`
- Each ticket on a new line

**Example Output:**
```
TICKET-001 In progress
TICKET-002 WFC
TICKET-003 Resolved
```

**Criteria:**
- Only tickets with `lastUpdated` within last 24 hours
- Includes all tickets matching criteria
- Uses prefix text from Settings

### Export Tasks
**Location**: Import/Export → Export Tasks

**What It Does:**
- Downloads all tasks as CSV file
- File name: `tasks-export.csv`
- Includes all task fields

**CSV Columns:**
- ticketNumber
- statusInternal
- statusExternal
- todo
- rank
- notes
- askedTo
- lastUpdated
- tags (comma-separated)

**Usage:**
- Backup your data
- Share tasks with others
- Migrate to another browser/computer

### Import Tasks
**Location**: Import/Export → Import Tasks

**What It Does:**
- Uploads CSV file and replaces ALL existing tasks
- ⚠️ **Warning**: This completely replaces current tasks
- Confirmation dialog shown before import

**Requirements:**
- CSV file format matching export format
- At minimum: `ticketNumber` column required
- Other columns optional (will use defaults)

**Process:**
1. Click "Choose CSV File"
2. Select CSV file
3. Confirm replacement in dialog
4. All tasks replaced with imported data
5. Success message shown

**Important:**
- Export current tasks first as backup
- Imported tasks get new IDs if not provided
- `lastUpdated` uses current timestamp if not provided
- Tags parsed from comma-separated string

---

## Status System

### Internal vs External Status

**Internal Status:**
- User-selectable status
- Customizable options in Settings
- Used for internal tracking
- Examples: new, validating, waiting-internal, resolved

**External Status:**
- Auto-calculated from internal status
- Not directly editable
- Uses status mapping from Settings
- Examples: new, In validation, WFC, In progress, Resolved

### Status Mapping
- Configured in Settings → Status Mapping Configuration
- One-to-one mapping: Each internal status maps to one external status
- Automatically applied when internal status is selected
- Can be changed anytime in Settings

### Status Calculation
**When you select internal status:**
1. App looks up status mapping
2. Finds corresponding external status
3. Sets both fields automatically
4. External status shown as read-only

**Example Flow:**
```
User selects: "validating"
↓
App checks mapping: validating → "In validation"
↓
Sets statusExternal = "In validation"
↓
Shows in form as read-only
```

---

## Troubleshooting

### Tasks Not Showing
**Possible Causes:**
1. localStorage cleared
2. CSV file missing or corrupted
3. Filter applied hiding tasks

**Solutions:**
1. Check localStorage in DevTools
2. Verify `src/data/tasks.csv` exists
3. Clear filters in page

### Settings Not Saving
**Possible Causes:**
1. localStorage quota exceeded
2. Browser storage disabled
3. Private/Incognito mode

**Solutions:**
1. Clear some browser data
2. Check browser storage permissions
3. Use regular browsing mode

### CSV Import Not Working
**Possible Causes:**
1. Invalid CSV format
2. Missing required columns
3. File encoding issues

**Solutions:**
1. Verify CSV format matches export format
2. Ensure `ticketNumber` column exists
3. Try exporting first, then modifying that file

### External Status Not Updating
**Possible Causes:**
1. Status mapping not configured
2. Internal status not in mapping

**Solutions:**
1. Check Settings → Status Mapping Configuration
2. Ensure all internal statuses have mappings

### Dark Mode Not Working
**Possible Causes:**
1. Settings not saved
2. Browser cache issue

**Solutions:**
1. Toggle dark mode in Settings
2. Clear browser cache
3. Check localStorage has settings saved

### Data Lost After Browser Close
**Possible Causes:**
1. Using Incognito/Private mode
2. Browser set to clear data on exit
3. localStorage disabled

**Solutions:**
1. Use regular browsing mode
2. Check browser privacy settings
3. Enable localStorage in browser

---

## Technical Details

### Data Structure

**Task Object:**
```javascript
{
  id: string,              // Unique identifier
  ticketNumber: string,     // Required, unique
  statusInternal: string,   // Selectable
  statusExternal: string,  // Auto-calculated
  todo: string,            // Optional
  rank: string,            // Optional
  notes: string,           // Optional
  askedTo: string,         // Optional
  lastUpdated: string,     // Auto-generated timestamp
  tags: string[]           // Array of tag strings
}
```

**Settings Object:**
```javascript
{
  darkMode: boolean,
  prefixText: string,
  enums: {
    statusInternal: string[],
    todo: string[],
    rank: string[]
  },
  statusMapping: {
    [internalStatus]: externalStatus
  }
}
```

### File Locations

**Source Files:**
- Tasks CSV: `src/data/tasks.csv`
- Settings CSV: `src/data/settings.csv`
- Manual: `public/manual.md` (this file)

**Storage:**
- Tasks: `localStorage.getItem('ticket_tasks')`
- Settings: `localStorage.getItem('ticket_settings')`

### Default Values

**Default Enums:**
- statusInternal: ["new", "validating", "waiting-external", "waiting-internal", "resolved", "resolved-wfc", "someone else is handling"]
- todo: ["yes-priority", "yes", "no"]
- rank: ["normal", "high"]

**Default Status Mapping:**
```javascript
{
  "new": "new",
  "validating": "In validation",
  "waiting-external": "WFC",
  "waiting-internal": "In progress",
  "resolved": "Resolved",
  "resolved-wfc": "WFC",
  "someone else is handling": "WFC"
}
```

### Browser Compatibility
- Modern browsers with localStorage support
- Chrome, Firefox, Edge, Safari (latest versions)
- Works offline (no internet required)
- Requires JavaScript enabled

---

## Best Practices

1. **Regular Backups**: Export tasks regularly as CSV backups
2. **Unique Ticket Numbers**: Ensure ticket numbers are unique
3. **Status Mapping**: Configure status mapping before creating many tickets
4. **Tags**: Use consistent tag names for better filtering
5. **Notes**: Keep notes concise but informative
6. **Dark Mode**: Use according to environment/comfort

---

## Support

### Manual Access
This manual is located at: `public/manual.md`

### Checking Data
- Use browser DevTools → Application/Storage → Local Storage
- Keys: `ticket_tasks` and `ticket_settings`

### Resetting Data
- **Tasks**: Clear localStorage or import empty CSV
- **Settings**: Use "Reset to Defaults" button in Settings

---

**Last Updated**: Application Version - Current
**Data Persistence**: localStorage (persists across sessions)
**Offline Support**: Yes (fully functional offline)

