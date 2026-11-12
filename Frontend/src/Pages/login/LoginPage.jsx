import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getRoleHome } from '../../contexts/AuthContext';

const LoginPage = () => {
	const navigate = useNavigate();
	const { currentUser, login } = useAuth();
	const [formData, setFormData] = useState({ username: '', password: '', rememberMe: true });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (currentUser) {
			navigate(getRoleHome(currentUser.role), { replace: true });
		}
	}, [currentUser, navigate]);

	const handleChange = (event) => {
		const { name, value, type, checked } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		setLoading(true);

		try {
			const user = await login(formData);
			navigate(getRoleHome(user.role), { replace: true });
		} catch (loginError) {
			setError(loginError.message || 'Không thể đăng nhập.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(63,81,181,0.18),_transparent_35%),linear-gradient(135deg,_#eef2ff_0%,_#f8fafc_55%,_#ffffff_100%)] px-4 py-12 flex items-center justify-center">
			<div className="w-full max-w-md rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
				<div className="text-center mb-8">
					<div className="mx-auto h-16 w-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 shadow-sm">
						<i className="fas fa-graduation-cap text-[#3F51B5] text-3xl animate-pulse" />
					</div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3F51B5]">Hệ Thống Quản Lý</p>
					<h2 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">Đăng Nhập Hệ Thống</h2>
					<p className="mt-2 text-sm text-slate-500">Vui lòng nhập tài khoản và mật khẩu của bạn.</p>
				</div>

				{error && (
					<div className="mb-6 rounded-2xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
						<i className="fas fa-exclamation-circle text-red-500" />
						<span className="font-semibold">{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<label className="block">
						<span className="mb-2 block text-sm font-semibold text-slate-700">Tài khoản (MSSV / Mã GV)</span>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							autoComplete="username"
							required
							placeholder="Nhập tên đăng nhập..."
							className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3F51B5] focus:bg-white focus:ring-4 focus:ring-indigo-100 font-semibold"
						/>
					</label>

					<label className="block">
						<span className="mb-2 block text-sm font-semibold text-slate-700">Mật khẩu</span>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							autoComplete="current-password"
							required
							placeholder="••••••••"
							className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#3F51B5] focus:bg-white focus:ring-4 focus:ring-indigo-100 font-semibold"
						/>
					</label>

					<div className="flex items-center justify-between gap-4">
						<label className="inline-flex items-center gap-2.5 text-sm text-slate-600 font-medium cursor-pointer select-none">
							<input
								type="checkbox"
								name="rememberMe"
								checked={formData.rememberMe}
								onChange={handleChange}
								className="h-4.5 w-4.5 rounded border-slate-300 text-[#3F51B5] focus:ring-[#3F51B5] transition"
							/>
							Ghi nhớ tài khoản
						</label>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-2xl bg-[#3F51B5] py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 active:scale-[0.98] transform disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
					>
						{loading ? (
							<>
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
								Đang xác thực...
							</>
						) : (
							<>
								<i className="fas fa-sign-in-alt" />
								Đăng nhập
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;