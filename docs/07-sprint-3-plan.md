# AAU Campus Market — Sprint 3 Plan

**Sprint:** Sprint 3
**Sprint Name:** React Web Application Foundation and Product Catalogue
**Status:** Planned
**Project:** AAU Campus Market

## 1. Sprint Goal

Establish the React web application inside `frontend-web/` and implement a functional product catalogue connected to the existing backend API.

By the end of this sprint, users should be able to open the web application, view available products, search for products, and filter the catalogue using supported product attributes.

The existing Flutter application and backend must remain functional.

## 2. Sprint Objectives

1. Inspect the existing `frontend-web/` scaffold and determine what is already implemented.
2. Establish a working React, TypeScript, and Vite application if one does not already exist.
3. Connect the web application to the existing backend API.
4. Display real products returned by the backend.
5. Implement product search and supported catalogue filters.
6. Handle loading, empty, and error states.
7. Test the web application and document the results.

## 3. Sprint Backlog

| ID    | Task                        | Description                                                                   | Priority |
| ----- | --------------------------- | ----------------------------------------------------------------------------- | -------- |
| S3-01 | Verify web scaffold         | Inspect existing files, dependencies, and configuration.                      | High     |
| S3-02 | Establish React application | Complete the existing scaffold or initialize the application if necessary.    | High     |
| S3-03 | Configure API connection    | Configure the backend base URL using environment variables.                   | High     |
| S3-04 | Implement product service   | Retrieve products from the existing backend endpoint.                         | High     |
| S3-05 | Build product catalogue     | Display product information in a responsive layout.                           | High     |
| S3-06 | Add search and filters      | Support text search and relevant filters exposed by the API.                  | High     |
| S3-07 | Handle application states   | Provide loading indicators, empty results, and understandable error messages. | High     |
| S3-08 | Verify and document         | Run available checks and update project documentation.                        | High     |

## 4. Functional Requirements

### S3-01: Verify the Existing Scaffold

Inspect `frontend-web/` before modifying it.

Identify:

* Existing React components, if any.
* Package configuration and dependencies.
* Vite and TypeScript configuration.
* Existing styles and assets.
* Current API configuration.

Preserve useful existing work.

**Acceptance criteria:**

* The existing implementation has been assessed.
* Required changes are identified.
* No existing files are unnecessarily replaced.

### S3-02: Establish the React Application

Use the existing planned technology stack:

* React
* TypeScript
* Vite

Create or complete the application using the repository's existing conventions.

**Acceptance criteria:**

* The application starts locally.
* TypeScript configuration works.
* The development server runs without application-breaking errors.
* The Flutter application's existing `web/` directory is not modified for this purpose.

### S3-03: Configure Backend Communication

Connect the web application to the existing Express backend.

Use an environment variable such as:

`VITE_API_BASE_URL`

Determine the correct API address and port from the actual backend configuration. Do not assume the port or endpoint without checking.

**Acceptance criteria:**

* API requests use the configured backend address.
* Local development configuration is documented.
* Secrets are not committed.
* CORS and network errors are handled appropriately.

### S3-04: Implement Product Retrieval

Inspect the existing product API and its response format before writing the frontend service.

Retrieve real products from the backend.

Display relevant available information, such as:

* Product name.
* Price.
* Product image, when available.
* Category.
* Stock availability.
* Campus availability, when supported by the API.

**Acceptance criteria:**

* Product data comes from the existing backend.
* The frontend does not depend on hardcoded demonstration products for normal operation.
* Missing optional fields do not crash the application.
* API errors are handled correctly.

### S3-05: Build the Product Catalogue

Create a clear, responsive catalogue suitable for desktop and mobile browsers.

Include:

* Application header.
* Product search field.
* Product grid.
* Product cards.
* Product prices and availability.
* Appropriate empty and loading states.

Use the existing project identity and design conventions where available.

**Acceptance criteria:**

* Products display correctly.
* The layout adapts to different screen widths.
* Missing product images are handled gracefully.
* Unavailable products are represented accurately.

### S3-06: Implement Search and Filtering

Implement product search and relevant filters supported by the backend.

Potential filters include:

* Product category.
* Campus.
* Product availability.

Use the backend's existing capabilities where appropriate rather than duplicating filtering logic unnecessarily.

**Acceptance criteria:**

* Search returns appropriate results.
* Filters work correctly.
* Search and filter combinations behave consistently.
* Empty results are communicated clearly.

### S3-07: Handle Errors and Loading

Implement:

* Loading indicators.
* Empty catalogue messages.
* Network failure messages.
* Retry functionality where appropriate.

**Acceptance criteria:**

* Users can distinguish loading, empty, and failed states.
* A failed request does not crash the application.
* The interface does not falsely indicate that products were loaded successfully.

### S3-08: Testing and Verification

Run the available frontend checks, including appropriate commands such as:

```powershell
npm run dev
npm run build
```

Run linting and automated tests if configured.

Verify the connection to the real backend when the environment permits.

**Acceptance criteria:**

* The application starts successfully.
* The production build succeeds.
* Product retrieval is verified against the actual API.
* Search and filtering are tested.
* Any remaining failures are documented honestly.

## 5. Definition of Done

Sprint 3 is complete when:

* [ ] The React application runs inside `frontend-web/`.
* [ ] The existing Flutter application remains intact.
* [ ] The web application connects to the existing backend.
* [ ] Real products are displayed.
* [ ] Product search works.
* [ ] Supported filters work.
* [ ] Loading, empty, and error states are implemented.
* [ ] The production build succeeds.
* [ ] Relevant tests and verification results are recorded.
* [ ] Documentation reflects the actual implementation.
* [ ] The changes are reviewed before committing.

## 6. Scope Boundaries

Unless required to resolve an existing blocker, Sprint 3 does not include:

* Rebuilding the backend.
* Rewriting the Flutter application.
* Implementing the complete checkout workflow.
* Implementing every seller, delivery-worker, or administrator feature in React.
* Replacing the existing authentication architecture.
* Adding unnecessary dependencies.

These features remain candidates for later sprints.

## 7. Risks and Dependencies

1. The existing frontend scaffold may require additional configuration.
2. The actual API response may differ from assumptions made during planning.
3. Backend availability and CORS configuration may affect integration.
4. Product images may be missing or inaccessible.
5. The frontend must remain compatible with the existing backend contract.

Resolve these issues using the actual repository rather than inventing replacement interfaces.

## 8. Sprint Review

Demonstrate:

1. Starting the React application.
2. Loading real products from the backend.
3. Searching for a product.
4. Filtering the catalogue.
5. Handling an empty result.
6. Handling a backend connection failure.
7. Building the application for production.

## 9. Next Sprint Direction

After Sprint 3, review the remaining Product Backlog and select the next highest-priority feature.

Possible directions include web authentication, product details, cart and checkout, or delivery-worker functionality, depending on the completed work and remaining dependencies.
