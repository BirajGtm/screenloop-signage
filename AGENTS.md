# Project maintenance

- Keep documentation in sync with code in the same change. Review README.md, chrome-extension/INSTALL.md, and chrome-extension/PRIVACY.md whenever behavior, setup, permissions, storage, controls, or testing changes; update affected documents before handing off.
- Document actual UI labels and implemented behavior, not planned features. Keep the installation guide a current workflow rather than accumulating contradictory release notes.
- Run relevant tests for behavior changes. Distinguish simulated checks from live Chrome verification and keep documented test commands current.
- Do not include personal installation paths, credentials, or private dashboard defaults in public documentation.
- Distinguish local changes from committed/pushed changes and store publication. Do not push or publish without authorization.
