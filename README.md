# The Oasis (Staff Portal)

Welcome to The Oasis staff portal! This application is designed to help staff manage bookings, cabins, users, guests, and various settings efficiently. Built with modern web technologies, it provides a seamless and intuitive user experience.

## Demo Link

You can explore this by clicking on [The Oasis for Staffs](https://josh-oasis.vercel.app/).

## Technologies Used

- **React**: For building user interfaces
- **React Query**: For data fetching and caching
- **React Router**: For client-side routing
- **Context API**: For managing global state
- **Styled Components**: For CSS-in-JS styling
- **Recharts**: For data visualization in the dashboard
- **React Hot Toast**: Library for notifications
- **React Hook Form**: Library for form management
- **Supabase** for User Authentication, DB and File Storage
- \*\*React-pdf : Library for invocies generation and view
- \*\*EmailJS : Library for sending invocies by email while checking-out.

## Application Features

- Implemented **URL state** for filtering, sorting, or pagination, using useSearchParams along with useQueryClient for **pre-fetching data**

- Implemented **Modal Window** using Compound Component Pattern, React Portal and Context API.

- **User Authentication**:

  - Login and Signup functionalities.
  - Authorization with role-based access control.

- **Booking Management**:

  - Create, read, update, and delete bookings.
  - Check-in and check-out management.
  - Add restaurant used amount by guests.
  - Generate and view invoices with options to print or email the invoices.

- **Cabin Management**:

  - Manage cabin details and availability.

- **Restaurant Management**:

  - Manage restaurants details and availability.

- **User and Guest Management**:

  - Manage user roles and guest information.

- **Settings Management**:

  - Configure settings like minimum/maximum nights, breakfast prices, etc.

- **Dashboard**:

  - Visualize data with Recharts (Line chart, Pie chart).

- **Dark/Light Mode**:
  - Toggle between dark and light themes.

## Getting Started

First, Create Environment Variables

- Create a `.env` file in the root directory of your project and add the following parameters:

  - VITE_SUPABASE_URL={Your Supabase URL}
  - VITE_SUPABASE_KEY={Your Supabase Key}
  - VITE_EMAILJS_SERVICEID={Your EmailJS ServiceId}
  - VITE_EMAILJS_PUBLIC_KEY={Your EmailJS Public Key}

Second, Install dependencies:

```bash
npm install

```

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The project is set up for **continuous integration and deployment** with GitHub and Vercel. To deploy the application, follow these steps:

1. Push your changes to the GitHub repository.
2. Vercel will automatically build and deploy the latest version of the application.

## Contact

Feel free to reach out to me for any questions or feedback:

- Email: [joshua80.ko@gmail.com](mailto:joshua80.ko@gmail.com)
