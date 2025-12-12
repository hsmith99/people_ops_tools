# Performance Review System

A comprehensive Google Sheets, Google Forms, and Apps Script-based performance review system that automates the entire review process from peer selection to completion tracking.

## 🌐 Live Documentation

**View the full documentation site:** [GitHub Pages](https://YOUR_USERNAME.github.io/people_ops_tools/)

## 🚀 Quick Start

1. **Create Google Sheet** - Run `setup()` function to initialize all sheets
2. **Create Google Forms** - Set up 3 forms (see `FORM_SETUP.md`)
3. **Configure Apps Script** - Copy `Code.gs` and update form IDs
4. **Set Up Triggers** - Configure automated triggers (see `TRIGGERS_SETUP.md`)

See `QUICK_START.md` for detailed instructions.

## 📋 Features

- ✅ **Multi-Sheet Architecture** - Separate sheets for each phase
- ✅ **Individual Peer Reviewer Columns** - Name + Email for each of 5 peers
- ✅ **Manager Confirmation** - Managers review and confirm peer selections
- ✅ **Automated Reminders** - Configurable reminder system
- ✅ **Scalable Design** - Handles 10 to 1000+ employees

## 📚 Documentation

All documentation is available in the repository:

- `QUICK_START.md` - Get started in 30 minutes
- `SYSTEM_OVERVIEW.md` - Complete system architecture
- `FORM_SETUP.md` - Google Forms configuration
- `MANAGER_CONFIRMATION_EXAMPLE.md` - Workflow examples
- `MIGRATION_GUIDE.md` - Upgrade from old version

## 🏗️ Architecture

The system uses a multi-sheet architecture:

- **Employees Sheet**: Master employee data
- **Peer Selection Sheet**: Phase 1 - Employee peer selection
- **Manager Confirmation Sheet**: Phase 2 - Manager confirmation
- **Review Assignments Sheet**: Phase 3 - All review assignments
- **Dashboard Sheet**: Optional summary and reporting

## 📖 Setup Instructions

1. Create a new Google Sheet
2. Go to Extensions → Apps Script
3. Copy `Code.gs` into the editor
4. Update CONFIG with your form IDs
5. Run `setup()` to initialize sheets
6. Create Google Forms following `FORM_SETUP.md`
7. Set up triggers following `TRIGGERS_SETUP.md`

## 🔧 Requirements

- Google Workspace account
- Google Sheets, Forms, and Apps Script access
- Gmail API enabled

## 📝 License

This project is provided as-is for internal use.

## 🤝 Support

For issues or questions, check the documentation files or review the execution logs in Apps Script.

