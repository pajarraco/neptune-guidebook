interface TopBannerProps {
  email: string;
  onSignOut: () => void;
}

export default function TopBanner({ email, onSignOut }: TopBannerProps) {
  return (
    <header className="topbar">
      <h1>Guidebook Admin</h1>
      <div className="topbar-right">
        <span className="email">{email}</span>
        <button onClick={onSignOut}>Sign out</button>
      </div>
    </header>
  );
}
