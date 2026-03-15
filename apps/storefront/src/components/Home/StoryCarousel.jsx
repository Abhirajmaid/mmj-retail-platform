import Story from "../common/Story";

const stories = [
  { id: 1, name: "User 1", image: "/1.png" },
  { id: 2, name: "User 2", image: "/2.png" },
  { id: 2, name: "User 2", image: "/3.png" },
  { id: 2, name: "User 2", image: "/4.png" },
  { id: 2, name: "User 2", image: "/3.png" },
  { id: 2, name: "User 2", image: "/2.png" },
  { id: 2, name: "User 2", image: "/4.png" },
];

const StoryCarousel = () => {
  return (
    <div className="flex overflow-x-scroll md:space-x-10 space-x-4 p-4 md:justify-center mt-12 hide-scroll">
      {stories.map((story) => (
        <Story key={story.id} name={story.name} image={story.image} />
      ))}
    </div>
  );
};

export default StoryCarousel;
