
// /pages/Signup/index.tsx
// ✅ ユーザー登録ページ

import { Link, Navigate } from 'react-router-dom';
import './auth.css';
import { useState } from 'react';
import { authRepository } from '../../modules/auth/auth.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';


function Signup() {
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);

  const { currentUser ,setCurrentUser } = useCurrentUserStore();

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(isLoading) return;

    if(name == "" || email == "" || password == "") return;

    try {
      setIsLoading(true);
      setError(null);

      const { user, token } = await authRepository.signup(name, email, password);
      // console.log(user, token);
      // Header(トークンの種類など)、Payload(データ)、Signature(改竄防止のための署名)の3つで構成
      
      localStorage.setItem("token", token); // ローカルストレージに保存

      setCurrentUser(user); // グローバルステートを更新

    } catch(e) {
      setError("登録に失敗しました。");
      console.error("登録に失敗しました。", e);
    } finally {
      setIsLoading(false);
    }
  }

  if(currentUser != null) return <Navigate to="/" />
  // null、undefinedでもないならなる

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h1 className="signup-title">Sign up to continue</h1>
        <p className="signup-subtitle">
          Use your email or another service to continue
        </p>

        <form onSubmit={ handleSubmit }>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Full name" 
              required 
              value={ name }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="email" 
              placeholder="Email" 
              required 
              value={ email }
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={ password }
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </div>

          {
            error && <p style={{ color: "red" }}>{ error }</p>
          }

          <button
            // onClick={ signup } 
            type="submit" 
            className="continue-button"
            disabled={ name == "" || email == "" || password == "" }
          >
            { isLoading ? "Creating" : "Continue" }
          </button>
        </form>
        <p className="signin-link">
          ログインは <Link to="/signin">こちら</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
