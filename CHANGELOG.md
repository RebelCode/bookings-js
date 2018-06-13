# Change log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [[*next-version*]] - YYYY-MM-DD

## [0.1.21] - 2018-06-13
### Added
- Session length limit property for session lengths component.

## [0.1.20] - 2018-06-12
### Changed
- The DateTime picker now always produces a value in `ISO8601` format.
- `day` and `week` time units for session length are temporary disabled.

### Fixed
- Daylight saving issue during rendering of repeating all-day events in availability calendar.

## [0.1.19] - 2018-06-11
### Changed
- A logic and UX for actions in booking editor.

## [0.1.18] - 2018-06-11
### Fixed
- Minutes are shown for each item in bookings list.

## [0.1.17-alpha18] - 2018-06-09
### Added
- Rest API errors handling.

### Changed
- The default value for Repeats - Ends After is 1, not 4, for all units.
- Repeating period uses start date for determining repetition ends, not start of period.

### Fixed
- Availability calendar daylight saving problem.
