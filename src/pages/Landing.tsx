const Landing = () => {
  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      margin: 0,
      padding: 0
    }}>
      <iframe
        src="/landing/index.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          flex: 1
        }}
      />
    </div>
  );
};

export default Landing;