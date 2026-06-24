import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {

    const [requestType, setRequestType]
        = useState('');

    const [targetDate, setTargetDate]
        = useState('');

    const [reason, setReason]
        = useState('');

    const [image, setImage]
        = useState(null);

    const submit = (e) => {
        e.preventDefault();
        router.post(
            '/leave-request/apply',
            {
                request_type: requestType,
                start_date: targetDate,
                reason: reason,
                image: image,
            },
            {
                forceFormData: true,

                onSuccess: () => {

                    alert(
                        '届出を申請しました'
                    );

                    router.get(
                        '/leave-requests'
                    );
                },

                onError: (errors) => {

                    console.log(errors);

                    alert(
                        '申請に失敗しました'
                    );
                }
            }
        );
    };

    return (
        <MainLayout>

            <Head title="届出申請" />

            <div
                className="
                    max-w-3xl
                    mx-auto
                    bg-white
                    p-8
                    shadow
                    rounded
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                        mb-8
                    "
                >
                    届出申請画面
                </h1>

                <form onSubmit={submit}>

                    {/* 届出区分 */}
                    <div className="mb-4">

                        <label className="font-bold">
                            届出区分
                        </label>

                        <select
                            value={requestType}
                            onChange={(e) =>
                                setRequestType(
                                    e.target.value
                                )
                            }
                            className="
                                border
                                p-2
                                w-full
                                rounded
                            "
                        >
                            <option value="">
                                選択してください
                            </option>

                            <option value="振替出勤">
                                振替出勤
                            </option>

                            <option value="振替休日">
                                振替休日
                            </option>

                            <option value="欠勤">
                                欠勤
                            </option>

                            <option value="有給">
                                有給
                            </option>

                            <option value="特別休暇">
                                特別休暇
                            </option>

                        </select>

                    </div>

                    {/* 対象日 */}
                    <div className="mb-4">

                        <label className="font-bold">
                            対象日
                        </label>

                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) =>
                                setTargetDate(
                                    e.target.value
                                )
                            }
                            className="
                                border
                                p-2
                                w-full
                                rounded
                            "
                        />

                    </div>

                    {/* 理由 */}
                    <div className="mb-4">

                        <label className="font-bold">
                            理由
                        </label>

                        <textarea
                            value={reason}
                            onChange={(e) =>
                                setReason(
                                    e.target.value
                                )
                            }
                            className="
                                border
                                p-2
                                w-full
                                rounded
                            "
                            rows="5"
                        />

                    </div>

                    {/* 添付画像 */}
                    <div className="mb-6">

                        <label className="font-bold">
                            添付画像
                        </label>

                        <input
                            type="file"
                            onChange={(e) =>
                                setImage(
                                    e.target.files[0]
                                )
                            }
                            className="
                                border
                                p-2
                                w-full
                            "
                        />

                    </div>

                    <button
                        type="submit"
                        className="
                            bg-blue-500
                            text-white
                            px-6
                            py-2
                            rounded
                        "
                    >
                        申請
                    </button>

                </form>

            </div>

        </MainLayout>
    );
}