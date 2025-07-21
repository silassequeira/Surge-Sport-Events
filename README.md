# Surge Coimbra – Sports Event Platform

**Author:** Silas Sequeira  
**Email:** silassequeiraa@gmail.com  
**Figma Prototype:** [View on Figma](https://www.figma.com/proto/AdPm9Alor1JbWfQU5aYfG9/si-25-design-challenge?node-id=6-27&t=uxPKpRZDmknBoLZw-1)  
**GitLab Repository:** [View on GitLab](https://gitlab.com/silassequeira/si-25-design-challenge)  

![Surge Coimbra Cover](./assets/images/cover.png)

## Project Vision

The goal of the project was to create a user-friendly and scalable static website that provides an intuitive experience for users to discover, register for, and manage local sports events. The project emphasized accessibility, modern aesthetics, and a maintainable codebase with room for future growth.

## Phase 1: Research + Branding

### Name & Branding

The name **"Surge"** was chosen to represent energy, movement, and momentum — all fundamental qualities of sports and active communities. It's a short, memorable, and dynamic name that fits the project's vision.

### Visual Identity

The visual language of Surge Coimbra was deeply inspired by the concept of motion drawing — a style that captures the energy, fluidity, and spontaneity of movement,rather than using static icons or rigid visuals, I leaned into expressive, hand-drawn illustrations and flowing shapes that evoke momentum, impact, and vitality, core to the spirit of sports.

The colors were selected with natural elements in mind, especially the Mondego River, which is central to Coimbra’s landscape.

## Phase 2: Design

Following the branding guidelines, the design phase focused on creating an intuitive and visually appealing user interface.

Design Inspirations: Influenced by modern digital experiences from platforms such as Linear, Coachella, CoimbraEventos, Finishers, and Active.com.

### Mockups

The process involved creating low and high-fidelity mockups to visualize the user experience and define the layout of the different pages. This iterative process helped to refine the design and ensure that the final product would be both functional and aesthetically pleasing.

### Designed Pages

- **Homepage**: A landing page with a brief "About" section and a slider highlighting upcoming events to immediately engage the user.
- **Events List**: A comprehensive list of all events, with filtering options by category and date, allowing users to easily find events that match their interests.
- **Single Event Page (Modal)**: Instead of a separate page, a modal window was used to display the details of a selected event. This approach provides a faster and more seamless user experience, as the user never has to leave the context of the events list.
- **Global Features**: A consistent navigation bar and footer were designed to provide easy access to all sections of the website, including contact information.

The design also included optional features like an "Add/Edit Event" form and an "Apply/Join Event" flow, which were later implemented in the build phase.

## Phase 3: Build

The build phase focused on turning the design mockups into a fully functional static website using HTML, CSS, and JavaScript. The development process was iterative, with a focus on creating a modular and maintainable codebase.

### Development Highlights (from Git History)

1.  **Initial Setup**: The project started with a basic setup, including the creation of an SVG sprite system for efficient icon management.
2.  **Core Feature Implementation**: The main event management system was implemented, including modals for event details, an image upload feature for new events, and a registration form. This single commit laid the foundation for the application's core functionality.
3.  **Event Slider and Notifications**: An event slider was added to the homepage to showcase upcoming events. A notification system was also implemented to provide feedback to the user after performing actions like registering for an event.
4.  **Continuous Refactoring and UI/UX Improvements**: A significant portion of the development process was dedicated to refactoring the code and improving the user experience. This included:
    - Improving the modularity of the JavaScript code.
    - Enhancing the event handling logic.
    - Standardizing button styles for consistency.
    - Improving the UI of modals and forms.
    - Adding a date picker and improving the date filtering logic.

### Technology Stack

- **HTML**: Semantic and accessible markup.
- **CSS**: A custom stylesheet with a dark/light theme, using modern features like CSS variables and a mobile-first approach.
- **JavaScript**: Modular, vanilla JavaScript for all the interactive and dynamic parts of the application, such as:
  - Filtering events.
  - Displaying event details in modals.
  - Handling form submissions.
  - Managing the event slider.

## Conclusion

Surge Coimbra demonstrates a complete end-to-end web development process, from branding and design to implementation. It delivers a performant, responsive, and accessible platform for local sports community. The site is not only visually engaging and user-friendly but also structured with scalability and future feature integration in mind.

