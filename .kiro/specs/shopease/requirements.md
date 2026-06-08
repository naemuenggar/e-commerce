# Requirements Document

## Introduction

ShopEase is a front-end-only e-commerce web application built as a portfolio piece to demonstrate modern, responsive, and user-friendly UI development. The application is built with Next.js (App Router), TypeScript, Tailwind CSS, and Zustand for state management. It uses local/dummy JSON product data with no real backend and no real payment gateway, and is deploy-ready for Vercel.

The application provides a complete shopping experience surface: browsing products, searching, filtering, sorting, viewing product details, managing a cart and wishlist, a dummy checkout flow with form validation, and dummy authentication screens. It includes responsive layouts (mobile-first), dark mode, toast notifications, loading/skeleton states, empty states, and Indonesian Rupiah currency formatting.

This document defines the functional and quality requirements for ShopEase. Because the application has no backend, all "persistence" refers to client-side state held during a browser session via the state management layer, and all authentication, checkout, and payment behaviors are simulated.

## Glossary

- **ShopEase**: The complete front-end e-commerce web application defined by this document.
- **System**: Synonym for ShopEase used when referring to the application as a whole.
- **Product_Catalog**: The local JSON dataset of dummy products loaded by the application.
- **Product**: A single catalog item with fields id, name, category, price, rating, stock, image, description, isNew, and isBestSeller.
- **Navbar**: The top navigation component containing the logo, navigation menu, login control, and responsive hamburger menu.
- **Hero_Section**: The home page banner containing a headline, subheadline, "Shop Now" call-to-action, and a product image.
- **Search_Component**: The UI control that filters products by matching text against product names.
- **Product_Listing_Page**: The page that displays the product grid with search, filter, and sort controls.
- **Product_Grid**: The responsive layout that arranges Product cards.
- **Product_Card**: The reusable component showing a product image, name, category, price, rating, "Add to Cart" button, wishlist icon, and a link to the detail page.
- **Product_Detail_Page**: The page showing full details for a single Product.
- **Filter_Component**: The UI controls that narrow the displayed products by category and by price.
- **Sort_Component**: The UI control that orders the displayed products by a selected criterion.
- **Cart**: The client-side collection of products and quantities a user intends to purchase.
- **Cart_Page**: The page that lists Cart items and the order summary.
- **Cart_Item**: A single entry in the Cart consisting of a Product and a quantity.
- **Wishlist**: The client-side collection of products a user has marked as liked.
- **Wishlist_Page**: The page that lists Wishlist items.
- **Checkout_Page**: The page containing the dummy order form and order summary.
- **Checkout_Form**: The form collecting full name, email, phone, full address, city, postal code, and payment method.
- **Order_Summary**: The component displaying subtotal, shipping, discount, and total amounts.
- **Auth_Screens**: The dummy Login and Register screens.
- **Toast_Notification**: A transient on-screen message confirming an action.
- **Theme_Toggle**: The control that switches between light and dark visual themes.
- **State_Store**: The Zustand-based client-side state management layer that holds Cart, Wishlist, and theme state during a browser session.
- **Rupiah_Format**: The Indonesian Rupiah currency display format using "Rp" prefix and "." as the thousands separator (for example, "Rp 250.000").
- **Skeleton_State**: A placeholder UI shown while product content is being prepared for display.
- **Empty_State**: A UI shown when a collection (products, cart, or wishlist) contains no items.

## Requirements

### Requirement 1: Product Data Catalog

**User Story:** As a shopper, I want a catalog of products with consistent details, so that I can browse realistic items across the application.

#### Acceptance Criteria

1. THE Product_Catalog SHALL contain at least 20 Product entries.
2. THE Product_Catalog SHALL provide each Product with the fields id (number), name (string), category (string), price (number), rating (number), stock (number), image (string), description (string), isNew (boolean), and isBestSeller (boolean).
3. THE Product_Catalog SHALL assign each Product a category value from the set {Fashion, Electronics, Shoes, Accessories, Beauty, Home Living}.
4. THE Product_Catalog SHALL assign each Product a unique id value.
5. THE System SHALL display all monetary Product price values using Rupiah_Format.

### Requirement 2: Global Navigation

**User Story:** As a shopper, I want consistent navigation, so that I can reach any section of the application from any page.

#### Acceptance Criteria

1. THE Navbar SHALL display a logo, navigation links for Home, Products, Categories, Cart, and Wishlist, and a Login control.
2. WHEN a user selects a Navbar navigation link, THE System SHALL navigate to the corresponding page.
3. WHILE the viewport width is at or below the mobile breakpoint, THE Navbar SHALL present the navigation links inside a hamburger menu control.
4. WHEN a user activates the hamburger menu control, THE Navbar SHALL toggle the visibility of the navigation links.
5. THE Navbar SHALL display the current count of items in the Cart.

### Requirement 3: Home Page Presentation

**User Story:** As a shopper, I want an engaging home page, so that I can discover featured content and start shopping quickly.

#### Acceptance Criteria

1. THE System SHALL display on the home page the Hero_Section, the Search_Component, a featured categories section, a featured products section, a promo banner, a best seller section, and a footer.
2. THE Hero_Section SHALL display a headline, a subheadline, a "Shop Now" call-to-action control, and a product image.
3. WHEN a user activates the "Shop Now" call-to-action, THE System SHALL navigate to the Product_Listing_Page.
4. THE best seller section SHALL display only Products whose isBestSeller field is true.
5. WHEN a user selects a featured category, THE System SHALL navigate to the Product_Listing_Page filtered by the selected category.

### Requirement 4: Product Search

**User Story:** As a shopper, I want to search products by name, so that I can quickly find a specific item.

#### Acceptance Criteria

1. WHEN a user enters text into the Search_Component, THE System SHALL display only Products whose name contains the entered text using case-insensitive matching.
2. WHEN the Search_Component text is empty, THE System SHALL display all Products that satisfy the active filters.
3. IF no Product matches the entered search text, THEN THE System SHALL display the Empty_State on the Product_Listing_Page.

### Requirement 5: Product Listing and Grid

**User Story:** As a shopper, I want to view products in a responsive grid, so that I can browse the catalog comfortably on any device.

#### Acceptance Criteria

1. THE Product_Listing_Page SHALL display Products in the Product_Grid.
2. THE Product_Card SHALL display the Product image, name, category, price, rating, an "Add to Cart" control, a wishlist control, and a link to the Product_Detail_Page.
3. WHEN a user selects a Product_Card link, THE System SHALL navigate to the Product_Detail_Page for the selected Product.
4. WHILE Product content is being prepared for display, THE Product_Listing_Page SHALL display the Skeleton_State.
5. IF the Product_Grid contains no Products after search and filters are applied, THEN THE Product_Listing_Page SHALL display the Empty_State.

### Requirement 6: Product Filtering

**User Story:** As a shopper, I want to filter products by category and price, so that I can narrow results to items that interest me.

#### Acceptance Criteria

1. WHEN a user selects a category in the Filter_Component, THE System SHALL display only Products whose category matches the selected category.
2. WHEN a user sets a price range in the Filter_Component, THE System SHALL display only Products whose price falls within the selected price range, inclusive of the range bounds.
3. WHEN a user applies both a category filter and a price range filter, THE System SHALL display only Products that satisfy both conditions.
4. WHEN a user clears the active filters, THE System SHALL display all Products that satisfy the active search text.

### Requirement 7: Product Sorting

**User Story:** As a shopper, I want to sort products, so that I can view items in my preferred order.

#### Acceptance Criteria

1. WHEN a user selects the lowest price sort option, THE Sort_Component SHALL order the displayed Products by price in ascending order.
2. WHEN a user selects the highest price sort option, THE Sort_Component SHALL order the displayed Products by price in descending order.
3. WHEN a user selects the highest rating sort option, THE Sort_Component SHALL order the displayed Products by rating in descending order.
4. WHEN a user selects the newest sort option, THE Sort_Component SHALL order the displayed Products so that Products with an isNew field of true appear before Products with an isNew field of false.

### Requirement 8: Product Detail

**User Story:** As a shopper, I want a detailed product page, so that I can review full information before purchasing.

#### Acceptance Criteria

1. THE Product_Detail_Page SHALL display the Product image, name, price, rating, description, stock information, and shipping information for the selected Product.
2. THE Product_Detail_Page SHALL display a quantity selector, an "Add to Cart" control, and an "Add to Wishlist" control.
3. WHEN a user adjusts the quantity selector, THE Product_Detail_Page SHALL set the selected quantity to a value between 1 and the Product stock value, inclusive.
4. WHEN a user activates the "Add to Cart" control, THE System SHALL add the selected Product and quantity to the Cart.
5. THE Product_Detail_Page SHALL display a related products section containing Products that share the category of the selected Product, excluding the selected Product.

### Requirement 9: Cart Management

**User Story:** As a shopper, I want to manage items in my cart, so that I can control what I intend to purchase.

#### Acceptance Criteria

1. THE Cart_Page SHALL display for each Cart_Item the Product image, name, unit price, a quantity selector, the subtotal for the Cart_Item, and a remove control.
2. WHEN a user adds a Product that already exists in the Cart, THE System SHALL increase the quantity of the existing Cart_Item by the added quantity.
3. WHEN a user changes the quantity of a Cart_Item, THE System SHALL update the Cart_Item subtotal to the product of the unit price and the new quantity.
4. WHEN a user activates the remove control on a Cart_Item, THE System SHALL remove the Cart_Item from the Cart.
5. THE Cart_Page SHALL display an Order_Summary containing the subtotal, the shipping amount, the discount amount, and the total amount.
6. THE Order_Summary total SHALL equal the subtotal plus the shipping amount minus the discount amount.
7. IF the Cart contains no Cart_Items, THEN THE Cart_Page SHALL display the Empty_State.
8. WHEN a user navigates between pages during a browser session, THE State_Store SHALL retain the Cart contents.

### Requirement 10: Wishlist Management

**User Story:** As a shopper, I want a wishlist, so that I can save products I am interested in for later.

#### Acceptance Criteria

1. WHEN a user activates a wishlist control on a Product, THE System SHALL add the Product to the Wishlist.
2. WHEN a user activates a wishlist control on a Product that already exists in the Wishlist, THE System SHALL remove the Product from the Wishlist.
3. THE Wishlist_Page SHALL display each Wishlist Product with a remove control and an "Add to Cart" control.
4. WHEN a user activates the "Add to Cart" control on a Wishlist Product, THE System SHALL add the Product to the Cart.
5. IF the Wishlist contains no Products, THEN THE Wishlist_Page SHALL display the Empty_State.
6. WHEN a user navigates between pages during a browser session, THE State_Store SHALL retain the Wishlist contents.

### Requirement 11: Checkout

**User Story:** As a shopper, I want a checkout form, so that I can complete a simulated order.

#### Acceptance Criteria

1. THE Checkout_Form SHALL collect full name, email, phone, full address, city, postal code, and a payment method selected from the set {Bank Transfer, E-Wallet, Cash on Delivery}.
2. THE Checkout_Page SHALL display the Order_Summary for the current Cart.
3. WHEN a user submits the Checkout_Form with one or more empty required fields, THE System SHALL display a validation message for each empty required field and SHALL retain the Checkout_Page.
4. IF the email field value does not match a valid email address format, THEN THE System SHALL display a validation message for the email field.
5. WHEN a user submits the Checkout_Form with all required fields populated and valid, THE System SHALL display an order success message stating "Your order has been placed successfully."
6. WHEN the System displays the order success message, THE System SHALL clear the Cart contents.

### Requirement 12: Dummy Authentication

**User Story:** As a visitor, I want login and registration screens, so that I can experience the account entry flow.

#### Acceptance Criteria

1. THE Auth_Screens SHALL provide a Login screen containing email, password, a remember me control, a forgot password link, and a login control.
2. THE Auth_Screens SHALL provide a Register screen containing full name, email, password, confirm password, and a register control.
3. WHEN a user submits the Login screen with an empty required field, THE System SHALL display a validation message for each empty required field.
4. IF the email field value on an Auth_Screen does not match a valid email address format, THEN THE System SHALL display a validation message for the email field.
5. IF the confirm password value does not match the password value on the Register screen, THEN THE System SHALL display a validation message for the confirm password field.

### Requirement 13: Toast Notifications

**User Story:** As a shopper, I want confirmation messages, so that I know when my actions succeed.

#### Acceptance Criteria

1. WHEN a user adds a Product to the Cart, THE System SHALL display a Toast_Notification confirming the addition.
2. WHEN a user adds a Product to the Wishlist, THE System SHALL display a Toast_Notification confirming the addition.
3. WHEN a Toast_Notification has been displayed for its configured duration, THE System SHALL dismiss the Toast_Notification.

### Requirement 14: Responsive Design

**User Story:** As a shopper, I want the application to adapt to my device, so that I can use it comfortably on desktop, tablet, and mobile.

#### Acceptance Criteria

1. THE System SHALL apply a mobile-first responsive layout across all pages.
2. WHILE the viewport width is within the mobile range, THE Product_Grid SHALL arrange Product cards in a single column.
3. WHILE the viewport width is within the tablet range, THE Product_Grid SHALL arrange Product cards in two columns.
4. WHILE the viewport width is within the desktop range, THE Product_Grid SHALL arrange Product cards in three or more columns.

### Requirement 15: Dark Mode

**User Story:** As a shopper, I want a dark mode toggle, so that I can choose a comfortable visual theme.

#### Acceptance Criteria

1. THE System SHALL provide a Theme_Toggle control.
2. WHEN a user activates the Theme_Toggle, THE System SHALL switch the active theme between light and dark.
3. WHEN a user navigates between pages during a browser session, THE State_Store SHALL retain the selected theme.

### Requirement 16: Component Reusability and Code Quality

**User Story:** As a reviewing developer, I want a clean reusable component structure, so that I can assess front-end development skills.

#### Acceptance Criteria

1. THE System SHALL implement the reusable components Navbar, Footer, Hero, ProductCard, ProductGrid, ProductFilter, ProductSort, SearchBar, CartItem, WishlistItem, CheckoutForm, Button, Input, Modal, SkeletonCard, and EmptyState.
2. THE System SHALL implement all application source files in TypeScript.
3. THE System SHALL render all displayed currency values using Rupiah_Format.

### Requirement 17: Project Deliverables and Documentation

**User Story:** As a reviewing developer, I want complete documentation and deployment readiness, so that I can run and evaluate the project.

#### Acceptance Criteria

1. THE System SHALL include a README.md containing the project name, description, key features, tech stack, a screenshot placeholder, installation steps, run steps, a demo link placeholder, and an author section.
2. THE README.md SHALL include instructions for running the application locally.
3. THE README.md SHALL include instructions for deploying the application to Vercel.
4. THE README.md SHALL include an explanation of the project folder structure.
5. THE README.md SHALL include a section listing suggested future enhancements.
