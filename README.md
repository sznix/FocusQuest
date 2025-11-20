# FocusQuest

A quest-based task manager built with Next.js, TypeScript, and Tailwind CSS. Organize your tasks into Backlog, Doing, and Done columns with persistent local storage.

![FocusQuest](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Features

- **Quest Creation** - Add new quests with title and optional description
- **Kanban Board** - Three columns: Backlog, Doing, Done
- **Status Management** - Move quests through your workflow:
  - **Start** button - Move from Backlog to Doing
  - **Complete** button - Move from Doing to Done
- **Delete Quests** - Remove individual quests you no longer need
- **Clear All** - Reset your entire quest board with one click
- **LocalStorage Persistence** - Your quests are saved automatically and persist across browser sessions
- **Quest Summary** - Real-time stats showing total quests and breakdown by status
- **Completion Celebration** - Get a special message when all quests are complete 🎉
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Easy on the eyes with a modern slate color scheme

## 🔧 Requirements

- **Node.js** 18.17.0 or higher
- **npm** 9.0.0 or higher (or **pnpm** / **yarn**)

## 🚀 Getting Started

### Option 1: Clone from GitHub

```bash
# Clone the repository
git clone https://github.com/YOUR_USER/focusquest.git

# Navigate to the project directory
cd focusquest

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Option 2: Create from Scratch

```bash
# Create a new Next.js project
npx create-next-app@latest focusquest --typescript --tailwind --app --no-src

# Navigate to the project directory
cd focusquest

# Replace the default files with FocusQuest files
# (Copy app/page.tsx, app/layout.tsx, app/globals.css, etc.)

# Install dependencies
npm install

# Run the development server
npm run dev
```

## 📦 Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload when you make changes. You may also see lint errors in the console.

### `npm run build`

Builds the app for production to the `.next` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm start`

Starts the production server after running `npm run build`.

```bash
npm run build
npm start
```

The production server will run at [http://localhost:3000](http://localhost:3000).

### `npm run lint`

Runs ESLint to check for code quality issues.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

FocusQuest is optimized for deployment on [Vercel](https://vercel.com), the platform created by the makers of Next.js.

**Steps:**

1. Push your code to a GitHub repository
2. Visit [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your `focusquest` repository
4. Vercel will automatically detect Next.js and configure the build settings
5. Click "Deploy" and wait for the build to complete
6. Your app will be live at `https://your-project.vercel.app`

**Custom Domain (Optional):**

In your Vercel project settings, you can add a custom domain.

### Deploy to Other Platforms

FocusQuest can also be deployed to:

- **Netlify** - Connect your repo and set build command to `npm run build`
- **Railway** - Supports Next.js out of the box
- **DigitalOcean App Platform** - Deploy directly from GitHub
- **Self-hosted** - Run `npm run build && npm start` on any Node.js server

## 🏗️ Project Structure

```
focusquest/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main quest board page
│   └── globals.css      # Global styles and Tailwind imports
├── public/              # Static assets
├── .github/
│   └── workflows/
│       └── ci.yml       # GitHub Actions CI workflow
├── .gitignore
├── next.config.mjs      # Next.js configuration
├── package.json
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── postcss.config.js    # PostCSS configuration
├── LICENSE              # MIT License
└── README.md
```

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) - React framework for production
- [React 18](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Project Link: [https://github.com/YOUR_USER/focusquest](https://github.com/YOUR_USER/focusquest)

## 🙏 Acknowledgments

- Inspired by kanban boards and quest-based productivity systems
- Built with modern web technologies and best practices
