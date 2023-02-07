import Layout from "../components/layout";

const Home = () => {
  return (
    <Layout>
      <h1>Home</h1>
      <p>Welcome to Anseo!</p>
      <div
        className="container text-center"
        style={{ width: "35%" }}
      >
        <div class="form-floating mt-5">
          <input
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="Session PIN"
            required
          />
          <label for="floatingInput">Session PIN</label>
          <button type="button" class="btn btn-secondary btn-lg mt-1 w-100">Join</button>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
