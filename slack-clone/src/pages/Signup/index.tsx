
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
      console.log(user, token);
      // User {id: 'd316d852-e195-47e1-bfc8-a9779ee55829', name: 'wataru', email: 'obito@gmail.com', thumbnailUrl: null, createdAt: '2026-05-19T08:00:34.000Z', …}
      // 'eyJhbGciOiJIUzI1NiJ9.ZDMxNmQ4NTItZTE5NS00N2UxLWJmYzgtYTk3NzllZTU1ODI5.BWvWAx0Ym2a7_z-jtEGtfki9Gz4tPjHWVAKzYojgxJI'
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

// import { Link } from 'react-router-dom';
// import './auth.css';
// import { useState } from 'react';
// import { authRepository } from '../../modules/auth/auth.repository';


// function Signup() {
//   const [ name, setName ] = useState("");
//   const [ email, setEmail ] = useState("");
//   const [ password, setPassword ] = useState("");

//   const signup = async () => {

//     if(name == "" || email == "" || password == "") return;

//     const { user, token } = await authRepository.signup(name, email, password);
//     console.log(user, token);
//     // User {id: '04b85ef1-c8c7-4897-90f1-89ac530e4700', name: 'yasukawa wataru', email: 'obito0531@gmail.com', thumbnailUrl: null, createdAt: '2026-05-19T07:33:23.000Z', …}

//   }


//   return (
//     <div className="signup-container">
//       <div className="signup-form-container">
//         <h1 className="signup-title">Sign up to continue</h1>
//         <p className="signup-subtitle">
//           Use your email or another service to continue
//         </p>

//         <div>
//           <div className="form-group">
//             <input 
//               type="text" 
//               placeholder="Full name" 
//               required 
//               value={ name }
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <input
//               type="email" 
//               placeholder="Email" 
//               required 
//               value={ email }
//               onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <input
//               type="password"
//               placeholder="Password"
//               required
//               value={ password }
//               onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={ signup } 
//             type="submit" 
//             className="continue-button"
//             disabled={ name == "" || email == "" || password == "" }
//           >
//             Continue
//           </button>
//         </div>
//         <p className="signin-link">
//           ログインは <Link to="/signin">こちら</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;
