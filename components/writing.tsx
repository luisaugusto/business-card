import { profile } from "@/lib/profile";
import { getWriting } from "@/lib/writing";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" });

export async function Writing() {
  const writing = await getWriting().catch(() => null);
  if (!writing?.posts.length) return null;
  return (
    <section className="writing rise" aria-labelledby="writing-heading">
      <div className="section-heading">
        <h2 id="writing-heading">Latest writing</h2>
        <a href={profile.publication} target="_blank" rel="noopener noreferrer">All posts <span aria-hidden="true">→</span></a>
      </div>
      <div className="posts">
        {writing.posts.map(post => (
          <a className="post" key={post.url} href={post.url} target="_blank" rel="noopener noreferrer">
            <div className="post-heading"><h3>{post.title}</h3><time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time></div>
            {post.excerpt ? <p>{post.excerpt}</p> : null}
          </a>
        ))}
      </div>
    </section>
  );
}
