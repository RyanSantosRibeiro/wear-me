export const ReferralsTable = ({ referrals }: { referrals: any[] }) => {
    return (
        <div>
            <h2>Referrals Table</h2>
            {referrals.map((referral) => (
                <div key={referral.id}>
                    <p>{referral.name}</p>
                    <p>{referral.email}</p>
                </div>
            ))}
        </div>
    )
}