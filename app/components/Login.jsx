

export default function Login() {
  return (
    <div>
      <form>
        <h3>Login Here</h3>

        <label htmlFor="email">Email</label>
        <input className="inputs" type="email" placeholder="Email" id="email" />

        <label htmlFor="password">Password</label>
        <input className="inputs" type="password" placeholder="Password" id="password" />

        <button type="button" className="loginbutton">Log In</button>

      </form>
    </div>
  );
}
