
// pages/Signin/index.tsx
// ✅ ログインページ

// 2つ目のアカウント
// name: aaa
// mail: aaa@gmail.com
// pass: aaa


import { Link, Navigate } from 'react-router-dom';
import '../Signup/auth.css';
import { useState } from 'react';
import { authRepository } from '../../modules/auth/auth.repository';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';


function Signin() {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState("");
  const { currentUser, setCurrentUser } = useCurrentUserStore();

  // ✅ ログインの処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(isLoading) return;
    if(email == "" || password == "") return;

    try {
      setIsLoading(true);

      const { user, token } = await authRepository.signin(email, password);
      // console.log(user, token);

      localStorage.setItem("token", token); // ローカルストレージに保存

      setCurrentUser(user); // 👉 グローバルステートを更新
                            // → Jotaiの状態を更新 → Signinコンポーネントを再レンダリング
                            // → <Navigate to="/">が発火して、/ に遷移

    } catch(e) {
      setError("ログインに失敗しました。");
      console.error("ログインに失敗しました", e);
    } finally {
      setIsLoading(false);
    }
  }

  // console.log(currentUser);
  if(currentUser != null) return <Navigate to="/" />

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h1 className="signup-title">Sign in</h1>
        <p className="signup-subtitle">メールアドレスでログインしてください</p>

        <form onSubmit={ handleSubmit }>
          <div className="form-group">
            {/* email */}
            <input  
              type="email" 
              placeholder="Email" 
              required 
              value={ email }
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            {/* パスワード */}
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={ password }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </div>

          { error && <p style={{ color: "red" }}>ログインに失敗しました。</p> }

          <button 
            type="submit" 
            className="continue-button"
            disabled={ email == "" || password == "" }
          >
            { isLoading ? "...Loading" : "Continue" }
          </button>
        </form>
        <p className="signin-link">
          ユーザー登録は<Link to="/signup">こちら</Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
