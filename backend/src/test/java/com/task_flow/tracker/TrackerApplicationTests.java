package com.task_flow.tracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import com.task_flow.tracker.model.Task;
import com.task_flow.tracker.repository.TaskRepository;
import org.springframework.data.domain.Sort;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertFalse;
import org.junit.jupiter.api.BeforeEach;
import java.time.OffsetDateTime;


@SpringBootTest
class TrackerApplicationTests {
    @Autowired
    TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        // Clear the repository before each test
        taskRepository.deleteAll();

        // Add some sample tasks for testing
        Task task1 = new Task();
        task1.setTitle("Example Task");
        task1.setDescription("This is an example task.");
        task1.setPriority(2);
        task1.setCompleted(false);
        task1.setCreatedAt(OffsetDateTime.now());
        taskRepository.save(task1);

        Task task2 = new Task();
        task2.setTitle("Unrelated Task");
        task2.setDescription("This is an unrelated task.");
        task2.setPriority(3);
        task2.setCompleted(true);
        task2.setCreatedAt(OffsetDateTime.now());
        taskRepository.save(task2);
    }

	@Test
	void contextLoads() {
	}

    @Test
    void testSearchFunctionality() {
        // Test searching for tasks with a specific title
        List<Task> tasks = taskRepository.findByTitleContainingIgnoreCase("example", Sort.by("createdAt").descending());
        assertFalse(tasks.isEmpty(), "Expected to find tasks with title containing 'example'");

        // Test searching for completed tasks
        List<Task> completedTasks = taskRepository.findByCompleted(true, Sort.by("createdAt").descending());
        assertFalse(completedTasks.isEmpty(), "Expected to find completed tasks");

        // Test searching for active tasks
        List<Task> activeTasks = taskRepository.findByCompleted(false, Sort.by("createdAt").descending());
        assertFalse(activeTasks.isEmpty(), "Expected to find active tasks");
    }
}
