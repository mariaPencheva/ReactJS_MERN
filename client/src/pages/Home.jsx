import React from "react";
import { useLocation } from "react-router-dom";
import Reviews from '.././components/Reviews';

function Home() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

return (
    <div>
        <div className="text">
            <h1>Task Board</h1>
            <p>facilitates collaboration and task distribution by</p>
            <p>providing an efficient way to manage projects and tasks in a team or individually.</p>
        </div>
        <div className="info-container">
            <h1>Why To Choose Task Board?</h1>

            <div className="info-boxes">
                <div className="info">
                    <h3>Cooperation and Support</h3>
                    <p>Task Board was created with the community in mind. Here, users can post tasks and projects that require help, and other users can chime in and offer their expertise. Whether you are an individual user or a representative of a company, Task Board helps you find people who are ready to support you and work together with you.</p>
                </div>

                <div className="info">
                    <h3>Convenience and Ease of Use</h3>
                    <p>Our application is extremely easy to use. With its intuitive interface and smooth navigation, you can quickly and easily post new tasks or find those you want to join. Registration is quick and easy, and managing your tasks is efficient and transparent.</p>
                </div>

                <div className="info">
                    <h3>Flexibility and Variety</h3>
                    <p>No matter the nature of the tasks - from short, one-time engagements to long-term projects - Task Board offers a platform where any task can find its executor. Thanks to the diversity of users, including various experts and professionals, every task can be completed qualitatively and on time.</p>
                </div>
            </div>
        </div>

        <div className="how-it-works">
            <h1>How It Works</h1>
            <div className="steps">
                <div className="step">
                    <h3>1. Post a Task</h3>
                    <p>Simply enter the details of your task, including a description, requirements, and deadline. Once posted, your task becomes visible to all users on the platform.</p>
                </div>
                <div className="step">
                    <h3>2. Find and Take Tasks</h3>
                    <p>Browse through the catalog of available tasks and select the ones that match your skills and interests. When you take a task, your name will be visible to everyone, making it easy to communicate and collaborate.</p>
                </div>
                <div className="step">
                    <h3>3. Review the Executors</h3>
                    <p>For each task, you can easily see which user has taken the commitment to complete it. This creates transparency and facilitates communication between the task creator and the executor.</p>
                </div>
            </div>
        </div>

        <Reviews />
    </div>
);
}

export default Home;
