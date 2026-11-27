import { Link } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import SalesReport from '../components/SalesReport.jsx'
import UsageReport from '../components/UsageReport.jsx'

export default function Admin() {
    const { user, checkingLogin } = useAuth()

    if (checkingLogin) {
        return <p>Loading...</p>
    }
    if (!user) {
        return (
            <div>
                <h2>Admin</h2>
                <p><Link to="/login">Log in</Link> with an admin account to see this page</p>
            </div>
        )
    }
    if (user.role !== 'admin') { // the server also blocks non-admins from the admin APIs
        return (
            <div>
                <h2>Admin</h2>
                <p>Admin access required</p>
            </div>
        )
    }

    return (
        <div>
            <h2>Admin</h2>
            <SalesReport />
            <UsageReport />
        </div>
    )
}
