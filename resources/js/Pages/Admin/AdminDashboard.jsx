import { router } from '@inertiajs/react';
import AdminLayout
    from '@/Layouts/AdminLayout';

export default function AdminDashboard({
    users = [],
}) {
    return (
        <AdminLayout>
            <div className="p-8">
                <div className="grid gap-4">
                    {users.map((user) => (
                        <button
                            key={user.id}
                            onClick={() =>
                                router.get(
                                    `/admin/user/${user.id}`
                                )
                            }
                            className="
                                border
                                rounded
                                p-4
                                text-left
                                hover:bg-gray-100
                            "
                        >
                            <div className="font-bold">
                                {user.name}
                            </div>

                            <div>
                                社員番号：
                                T000{user.id}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}