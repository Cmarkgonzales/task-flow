package com.task_flow.tracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.task_flow.tracker.model.Task;
import com.task_flow.tracker.repository.TaskRepository;
import com.task_flow.tracker.exception.ResourceNotFoundException;

import java.time.OffsetDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // Allow all origins for simplicity; adjust as needed
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Task> getAllTasks(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
        ) {
        Sort sorting = parseSortParam(sort);

        if (search != null) {
            if("completed".equalsIgnoreCase(status)) {
                return taskRepository.findByTitleContainingIgnoreCaseAndCompleted(search, true, sorting);
            } else if ("active".equalsIgnoreCase(status)) {
                return taskRepository.findByTitleContainingIgnoreCaseAndCompleted(search, false, sorting);
            } else {
                return taskRepository.findByTitleContainingIgnoreCase(search, sorting);
            }
        }

        if ("completed".equalsIgnoreCase(status)) {
            return taskRepository.findByCompleted(true, sorting);
        } else if ("active".equalsIgnoreCase(status)) {
            return taskRepository.findByCompleted(false, sorting);
        } else {
            return taskRepository.findAll(sorting);
        }
    }

    private Sort parseSortParam(String sortParam) {
        if (sortParam == null || sortParam.isEmpty()) {
            return Sort.unsorted();
        }

        String[] parts = sortParam.split("-");
        if (parts.length != 2) {
            return Sort.unsorted();
        }

        String field = parts[0];
        String direction = parts[1];
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

        // For priority, just sort by the integer field directly
        if ("priority".equalsIgnoreCase(field)) {
            return Sort.by(sortDirection, "priority");
        }

        // For other fields, map directly
        switch (field) {
            case "dueDate":
                return Sort.by(sortDirection, "dueDate");
            case "title":
                return Sort.by(sortDirection, "title");
            default:
                return Sort.unsorted();
        }
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        OffsetDateTime now = OffsetDateTime.now();
        task.setCreatedAt(now);
        task.setUpdatedAt(now);
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCompleted(taskDetails.isCompleted());
        task.setPriority(taskDetails.getPriority());
        task.setDueDate(taskDetails.getDueDate());
        task.setUpdatedAt(OffsetDateTime.now());

        final Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));
        
        taskRepository.delete(task);
        return ResponseEntity.noContent().build();
    }
}
