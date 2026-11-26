import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'

function stars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating) // e.g. 4 -> ★★★★☆
}

async function fetchReviews(vehicleId) {
    const json = await api('GET', '/api/vehicles/' + vehicleId + '/reviews')
    return json.data
}

export default function Reviews({ vehicleId }) {
    const { user } = useAuth()
    const [reviews, setReviews] = useState(null)
    const [error, setError] = useState('')
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [formError, setFormError] = useState('')
    const [message, setMessage] = useState('')
    const [hasBought, setHasBought] = useState(null)

    useEffect(() => {
        fetchReviews(vehicleId)
        .then((data) => setReviews(data))
        .catch((err) => setError(err.message))
    }, [vehicleId])

    useEffect(() => {
        if (!user) {
            return
        }
        // same rule as the server: only a paid (PROCESSED) order that includes this vehicle counts
        api('GET', '/api/orders')
        .then((json) => {
            const bought = json.data.some((order) =>
                order.status === 'PROCESSED' && order.items.some((item) => item.vehicleId === vehicleId)
            )
            setHasBought(bought)
        })
        .catch(() => setHasBought(false))
    }, [user, vehicleId])

    async function handleSubmit(e) {
        e.preventDefault()
        setFormError('')
        setMessage('')
        if (rating === 0) {
            setFormError('Choose a rating from 1 to 5 stars')
            return
        }

        setMessage('Submitting review...')
        try {
            await api('POST', '/api/vehicles/' + vehicleId + '/reviews', { rating, comment })
            setReviews(await fetchReviews(vehicleId)) // reload so the average includes the new review; the form then hides itself
            setRating(0)
            setComment('')
            setMessage('')
        } catch (err) {
            setMessage('')
            setFormError(err.message)
        }
    }

    if (error) {
        return <p>{error}</p>
    }
    if (!reviews) {
        return <p>Loading reviews...</p>
    }

    let summary = <p>No reviews yet</p>
    if (reviews.reviewCount > 0) {
        let reviewWord = 'reviews'
        if (reviews.reviewCount === 1) {
            reviewWord = 'review'
        }
        summary = <p>{stars(Math.round(reviews.averageRating))} {reviews.averageRating} out of 5 ({reviews.reviewCount} {reviewWord})</p>
    }

    let form
    if (!user) {
        form = <p><Link to="/login">Log in</Link> to review this vehicle.</p>
    } else if (reviews.reviews.some((review) => review.username === user.username)) {
        form = <p>You have already reviewed this vehicle.</p>
    } else if (hasBought === null) {
        form = null // still checking the customer's orders
    } else if (!hasBought) {
        form = <p>Only customers who have bought this vehicle can review it.</p>
    } else {
        form = (
            <form onSubmit={handleSubmit}>
                <h4>Write a review</h4>
                <p>
                    <label>Rating </label>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button type="button" key={n} onClick={() => setRating(n)} aria-label={n + ' stars'}>
                            {n <= rating ? '★' : '☆'}
                        </button>
                    ))}
                </p>
                <p>
                    <label>Comment (optional) </label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                </p>
                <button type="submit">Submit review</button>
                <p>{formError}</p>
                <p>{message}</p>
            </form>
        )
    }

    return (
        <section>
            <h3>Reviews</h3>
            {summary}
            {reviews.reviews.map((review) => (
                <div key={review.username}>
                    <p>{stars(review.rating)} by {review.username} on {new Date(review.createdAt).toLocaleDateString('en-CA')}</p>
                    <p>{review.comment}</p>
                </div>
            ))}
            {form}
        </section>
    )
}
