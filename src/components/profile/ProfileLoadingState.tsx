
const ProfileLoadingState = () => {
  return (
    <div className="min-h-screen chrome-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-foreground">Loading profile settings...</p>
      </div>
    </div>
  );
};

export default ProfileLoadingState;
