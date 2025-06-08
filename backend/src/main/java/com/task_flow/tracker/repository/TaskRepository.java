package com.task_flow.tracker.repository;

import com.task_flow.tracker.model.Task;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTitleContainingIgnoreCase(String title, Sort sort);
    List<Task> findByTitleContainingIgnoreCaseAndCompleted(String title, boolean completed, Sort sort);
    List<Task> findByCompleted(boolean completed, Sort sort);
    List<Task> findAll(Sort sort);
}
