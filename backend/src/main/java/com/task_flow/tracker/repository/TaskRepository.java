package com.task_flow.tracker.repository;

import com.task_flow.tracker.model.Task;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByCompleted(boolean completed, Sort sort);
    // Custom query methods can be defined here if needed
    // For example, to find tasks by completion status or priority:
}
