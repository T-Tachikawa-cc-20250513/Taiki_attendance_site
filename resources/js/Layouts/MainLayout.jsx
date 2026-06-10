import { Link, usePage } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <>
            <header className="bg-blue-600 text-white shadow">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                        勤怠管理システム
                    </h1>
                    <nav className="flex gap-4">
                        <Link href="/">
                            打刻
                        </Link>
                        {auth?.user && (
                            <Link href="/daily-attendance">
                                日次勤怠登録画面
                            </Link>
                        )}
                        <Link href="/attendances">
                            勤怠一覧
                        </Link>
                        <Link href="/admin">
                            管理者画面
                        </Link>
                        {auth?.user ? (
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                            >
                                ログアウト
                            </Link>
                        ) : (
                            <>
                                <Link href="/register">
                                    会員登録
                                </Link>

                                <Link href="/login">
                                    ログイン
                                </Link>
                            </>
                        )}
                    </nav>

                </div>
            </header>
            <main>
                {children}
            </main>
        </>
    );
}